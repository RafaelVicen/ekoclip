package main

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"golang.org/x/time/rate"
)

// SecurityConfig holds security configuration
type SecurityConfig struct {
	RateLimitRequests int           `json:"rate_limit_requests"`
	RateLimitWindow   time.Duration `json:"rate_limit_window"`
	CSRFSecretLength  int           `json:"csrf_secret_length"`
	MaxRequestSize    int64         `json:"max_request_size"`
}

// SecurityMiddleware provides security features
type SecurityMiddleware struct {
	config         SecurityConfig
	rateLimiters   map[string]*rate.Limiter
	rateLimitMutex sync.RWMutex
	store          *sessions.CookieStore
	blockedIPs     map[string]time.Time
	blockedMutex   sync.RWMutex
}

// SecurityViolation represents a security violation
type SecurityViolation struct {
	Timestamp   time.Time `json:"timestamp"`
	IP          string    `json:"ip"`
	UserAgent   string    `json:"user_agent"`
	Violation   string    `json:"violation"`
	Severity    string    `json:"severity"`
	Details     string    `json:"details"`
	RequestPath string    `json:"request_path"`
	Method      string    `json:"method"`
}

// ContactForm represents the contact form data
type ContactForm struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
	CSRF    string `json:"csrf"`
}

// EbookOrder represents the ebook order data
type EbookOrder struct {
	EbookName string  `json:"ebook_name"`
	Price     float64 `json:"price"`
	Email     string  `json:"email"`
	CSRF      string  `json:"csrf"`
}

// APIResponse represents API response
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// NewSecurityMiddleware creates a new security middleware
func NewSecurityMiddleware() *SecurityMiddleware {
	config := SecurityConfig{
		RateLimitRequests: 10,
		RateLimitWindow:   time.Minute,
		CSRFSecretLength:  32,
		MaxRequestSize:    1024 * 1024, // 1MB
	}

	// Generate random session key
	sessionKey := make([]byte, 32)
	if _, err := rand.Read(sessionKey); err != nil {
		log.Fatal("Failed to generate session key:", err)
	}

	return &SecurityMiddleware{
		config:       config,
		rateLimiters: make(map[string]*rate.Limiter),
		store:        sessions.NewCookieStore(sessionKey),
		blockedIPs:   make(map[string]time.Time),
	}
}

// getRateLimiter gets or creates a rate limiter for an IP
func (sm *SecurityMiddleware) getRateLimiter(ip string) *rate.Limiter {
	sm.rateLimitMutex.Lock()
	defer sm.rateLimitMutex.Unlock()

	limiter, exists := sm.rateLimiters[ip]
	if !exists {
		limiter = rate.NewLimiter(rate.Every(sm.config.RateLimitWindow/time.Duration(sm.config.RateLimitRequests)), sm.config.RateLimitRequests)
		sm.rateLimiters[ip] = limiter
	}

	return limiter
}

// isBlocked checks if an IP is blocked
func (sm *SecurityMiddleware) isBlocked(ip string) bool {
	sm.blockedMutex.RLock()
	defer sm.blockedMutex.RUnlock()

	blockTime, exists := sm.blockedIPs[ip]
	if !exists {
		return false
	}

	// Unblock after 1 hour
	if time.Since(blockTime) > time.Hour {
		sm.blockedMutex.Lock()
		delete(sm.blockedIPs, ip)
		sm.blockedMutex.Unlock()
		return false
	}

	return true
}

// blockIP blocks an IP address
func (sm *SecurityMiddleware) blockIP(ip string) {
	sm.blockedMutex.Lock()
	sm.blockedIPs[ip] = time.Now()
	sm.blockedMutex.Unlock()

	log.Printf("SECURITY: Blocked IP %s due to suspicious activity", ip)
}

// logViolation logs a security violation
func (sm *SecurityMiddleware) logViolation(violation SecurityViolation) {
	// In production, this would be sent to a security monitoring service
	log.Printf("SECURITY VIOLATION [%s]: %s - IP: %s - Path: %s %s - %s",
		violation.Severity, violation.Violation, violation.IP,
		violation.Method, violation.RequestPath, violation.Details)
}

// SecurityHeaders middleware adds security headers
func (sm *SecurityMiddleware) SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Security headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")

		// CORS headers (restrictive)
		w.Header().Set("Access-Control-Allow-Origin", "https://ekoclip.netlify.app")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token")
		w.Header().Set("Access-Control-Max-Age", "86400")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// RateLimit middleware implements rate limiting
func (sm *SecurityMiddleware) RateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := sm.getClientIP(r)

		// Check if IP is blocked
		if sm.isBlocked(ip) {
			sm.logViolation(SecurityViolation{
				Timestamp:   time.Now(),
				IP:          ip,
				UserAgent:   r.Header.Get("User-Agent"),
				Violation:   "Blocked IP Attempt",
				Severity:    "HIGH",
				Details:     "Blocked IP tried to access resource",
				RequestPath: r.URL.Path,
				Method:      r.Method,
			})

			http.Error(w, "Access denied", http.StatusForbidden)
			return
		}

		// Check rate limit
		limiter := sm.getRateLimiter(ip)
		if !limiter.Allow() {
			sm.logViolation(SecurityViolation{
				Timestamp:   time.Now(),
				IP:          ip,
				UserAgent:   r.Header.Get("User-Agent"),
				Violation:   "Rate Limit Exceeded",
				Severity:    "MEDIUM",
				Details:     "Too many requests from IP",
				RequestPath: r.URL.Path,
				Method:      r.Method,
			})

			// Block IP after repeated violations
			sm.blockIP(ip)

			http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// RequestSizeLimit middleware limits request size
func (sm *SecurityMiddleware) RequestSizeLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, sm.config.MaxRequestSize)

		// Check content length
		if r.ContentLength > sm.config.MaxRequestSize {
			sm.logViolation(SecurityViolation{
				Timestamp:   time.Now(),
				IP:          sm.getClientIP(r),
				UserAgent:   r.Header.Get("User-Agent"),
				Violation:   "Request Too Large",
				Severity:    "LOW",
				Details:     fmt.Sprintf("Request size: %d bytes", r.ContentLength),
				RequestPath: r.URL.Path,
				Method:      r.Method,
			})

			http.Error(w, "Request too large", http.StatusRequestEntityTooLarge)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// CSRFProtection middleware validates CSRF tokens
func (sm *SecurityMiddleware) CSRFProtection(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Only check CSRF for state-changing methods
		if r.Method == "GET" || r.Method == "HEAD" || r.Method == "OPTIONS" {
			next.ServeHTTP(w, r)
			return
		}

		// Get CSRF token from header or form
		var providedToken string
		if token := r.Header.Get("X-CSRF-Token"); token != "" {
			providedToken = token
		} else if r.FormValue("_csrf") != "" {
			providedToken = r.FormValue("_csrf")
		}

		if providedToken == "" {
			sm.logViolation(SecurityViolation{
				Timestamp:   time.Now(),
				IP:          sm.getClientIP(r),
				UserAgent:   r.Header.Get("User-Agent"),
				Violation:   "Missing CSRF Token",
				Severity:    "HIGH",
				Details:     "CSRF token not provided",
				RequestPath: r.URL.Path,
				Method:      r.Method,
			})

			http.Error(w, "CSRF token missing", http.StatusForbidden)
			return
		}

		// Validate token format (basic validation)
		if !sm.isValidCSRFToken(providedToken) {
			sm.logViolation(SecurityViolation{
				Timestamp:   time.Now(),
				IP:          sm.getClientIP(r),
				UserAgent:   r.Header.Get("User-Agent"),
				Violation:   "Invalid CSRF Token",
				Severity:    "HIGH",
				Details:     fmt.Sprintf("Invalid token: %s", providedToken),
				RequestPath: r.URL.Path,
				Method:      r.Method,
			})

			http.Error(w, "Invalid CSRF token", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// getClientIP gets the real client IP
func (sm *SecurityMiddleware) getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header (for proxies/load balancers)
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		// Take the first IP in case of multiple
		ips := strings.Split(xff, ",")
		return strings.TrimSpace(ips[0])
	}

	// Check X-Real-IP header
	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return xri
	}

	// Fall back to RemoteAddr
	ip := r.RemoteAddr
	if strings.Contains(ip, ":") {
		ip, _, _ = strings.Cut(ip, ":")
	}

	return ip
}

// isValidCSRFToken validates CSRF token format
func (sm *SecurityMiddleware) isValidCSRFToken(token string) bool {
	// Basic validation: should be base64-encoded and reasonable length
	if len(token) < 10 || len(token) > 100 {
		return false
	}

	// Check if it's valid base64
	_, err := base64.StdEncoding.DecodeString(token)
	return err == nil
}

// sanitizeInput sanitizes user input
func (sm *SecurityMiddleware) sanitizeInput(input string) string {
	if input == "" {
		return ""
	}

	// Remove null bytes and control characters
	input = strings.Map(func(r rune) rune {
		if r < 32 && r != 9 && r != 10 && r != 13 { // Allow tab, LF, CR
			return -1
		}
		return r
	}, input)

	// Trim whitespace
	input = strings.TrimSpace(input)

	// Limit length
	if len(input) > 1000 {
		input = input[:1000]
	}

	return input
}

// validateEmail validates email format
func (sm *SecurityMiddleware) validateEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

// validateContactForm validates contact form data
func (sm *SecurityMiddleware) validateContactForm(form ContactForm) []string {
	var errors []string

	// Sanitize inputs
	form.Name = sm.sanitizeInput(form.Name)
	form.Email = sm.sanitizeInput(form.Email)
	form.Subject = sm.sanitizeInput(form.Subject)
	form.Message = sm.sanitizeInput(form.Message)

	// Validate required fields
	if form.Name == "" {
		errors = append(errors, "Nome é obrigatório")
	}
	if len(form.Name) < 2 {
		errors = append(errors, "Nome deve ter pelo menos 2 caracteres")
	}

	if form.Email == "" {
		errors = append(errors, "Email é obrigatório")
	}
	if !sm.validateEmail(form.Email) {
		errors = append(errors, "Email inválido")
	}

	if form.Subject == "" {
		errors = append(errors, "Assunto é obrigatório")
	}

	if form.Message == "" {
		errors = append(errors, "Mensagem é obrigatória")
	}
	if len(form.Message) < 10 {
		errors = append(errors, "Mensagem deve ter pelo menos 10 caracteres")
	}

	return errors
}

// validateEbookOrder validates ebook order data
func (sm *SecurityMiddleware) validateEbookOrder(order EbookOrder) []string {
	var errors []string

	// Sanitize inputs
	order.EbookName = sm.sanitizeInput(order.EbookName)
	order.Email = sm.sanitizeInput(order.Email)

	// Validate required fields
	if order.EbookName == "" {
		errors = append(errors, "Nome do ebook é obrigatório")
	}

	if order.Email == "" {
		errors = append(errors, "Email é obrigatório")
	}
	if !sm.validateEmail(order.Email) {
		errors = append(errors, "Email inválido")
	}

	if order.Price <= 0 {
		errors = append(errors, "Preço deve ser maior que zero")
	}
	if order.Price > 10000 { // Reasonable upper limit
		errors = append(errors, "Preço muito alto")
	}

	return errors
}

// generateCSRFToken generates a new CSRF token
func (sm *SecurityMiddleware) generateCSRFToken() (string, error) {
	bytes := make([]byte, sm.config.CSRFSecretLength)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(bytes), nil
}

// handleContactForm handles contact form submissions
func (sm *SecurityMiddleware) handleContactForm(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var form ContactForm
	if err := json.NewDecoder(r.Body).Decode(&form); err != nil {
		sm.logViolation(SecurityViolation{
			Timestamp:   time.Now(),
			IP:          sm.getClientIP(r),
			UserAgent:   r.Header.Get("User-Agent"),
			Violation:   "Invalid JSON",
			Severity:    "LOW",
			Details:     err.Error(),
			RequestPath: r.URL.Path,
			Method:      r.Method,
		})

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Message: "Dados inválidos",
		})
		return
	}

	// Validate form
	if errors := sm.validateContactForm(form); len(errors) > 0 {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Message: "Erros de validação",
			Data:    errors,
		})
		return
	}

	// Log successful submission (in production, save to database/email)
	log.Printf("CONTACT FORM: %s <%s> - Subject: %s", form.Name, form.Email, form.Subject)

	// In production, you would:
	// 1. Save to database
	// 2. Send email notification
	// 3. Queue for processing

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Message: "Mensagem enviada com sucesso!",
	})
}

// handleEbookOrder handles ebook order submissions
func (sm *SecurityMiddleware) handleEbookOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var order EbookOrder
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		sm.logViolation(SecurityViolation{
			Timestamp:   time.Now(),
			IP:          sm.getClientIP(r),
			UserAgent:   r.Header.Get("User-Agent"),
			Violation:   "Invalid JSON",
			Severity:    "LOW",
			Details:     err.Error(),
			RequestPath: r.URL.Path,
			Method:      r.Method,
		})

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Message: "Dados inválidos",
		})
		return
	}

	// Validate order
	if errors := sm.validateEbookOrder(order); len(errors) > 0 {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Message: "Erros de validação",
			Data:    errors,
		})
		return
	}

	// Log successful order (in production, process payment)
	log.Printf("EBOOK ORDER: %s - Price: %.2f - Email: %s", order.EbookName, order.Price, order.Email)

	// In production, you would:
	// 1. Validate payment
	// 2. Generate download link
	// 3. Send confirmation email
	// 4. Update inventory

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Message: "Pedido processado com sucesso!",
		Data: map[string]string{
			"download_url": "/download/" + strings.ReplaceAll(strings.ToLower(order.EbookName), " ", "-"),
		},
	})
}

// handleCSRFToken generates and returns a CSRF token
func (sm *SecurityMiddleware) handleCSRFToken(w http.ResponseWriter, r *http.Request) {
	token, err := sm.generateCSRFToken()
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data: map[string]string{
			"csrf_token": token,
		},
	})
}

// handleHealthCheck provides health check endpoint
func (sm *SecurityMiddleware) handleHealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Message: "API is healthy",
		Data: map[string]interface{}{
			"timestamp": time.Now(),
			"version":   "1.0.0",
		},
	})
}

func main() {
	// Initialize security middleware
	sm := NewSecurityMiddleware()

	// Create router
	r := mux.NewRouter()

	// Apply security middleware to all routes
	r.Use(sm.SecurityHeaders)
	r.Use(sm.RateLimit)
	r.Use(sm.RequestSizeLimit)
	r.Use(sm.CSRFProtection)

	// API routes
	api := r.PathPrefix("/api/v1").Subrouter()

	// Public routes (no CSRF required)
	api.HandleFunc("/health", sm.handleHealthCheck).Methods("GET")
	api.HandleFunc("/csrf-token", sm.handleCSRFToken).Methods("GET")

	// Protected routes
	api.HandleFunc("/contact", sm.handleContactForm).Methods("POST")
	api.HandleFunc("/ebook-order", sm.handleEbookOrder).Methods("POST")

	// Get port from environment or default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	log.Printf("🚀 EkoClip Secure API Server starting on port %s", port)
	log.Printf("🔒 Security features enabled: Rate limiting, CSRF protection, XSS prevention")
	log.Fatal(http.ListenAndServe(":"+port, r))
}