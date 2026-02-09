/*
 * Form Handling with Formspree Integration
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const sendAnotherBtn = document.getElementById('send-another');
    
    if (contactForm) {
        // Handle form submission
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateContactForm()) {
                return;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Send to Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Show error message
                showFormMessage('error', 'Sorry, there was an error sending your message. Please try again or contact us directly.');
                
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
        
        // Handle "Send Another" button
        if (sendAnotherBtn) {
            sendAnotherBtn.addEventListener('click', function() {
                formSuccess.style.display = 'none';
                contactForm.style.display = 'block';
                
                // Reset form validation states
                const formGroups = contactForm.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    group.classList.remove('has-error');
                });
            });
        }
        
        // FAQ Toggle Functionality
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }
});

function validateContactForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;
    
    // Reset error states
    resetFormErrors([name, email, message]);
    
    // Validate name
    if (!name.value.trim()) {
        showFormError(name, 'Name is required');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        showFormError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFormError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        showFormError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFormError(message, 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

function showFormError(field, message) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('has-error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '5px';
    }
}

function resetFormErrors(fields) {
    fields.forEach(field => {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('has-error');
            
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message-${type}`;
    messageElement.textContent = message;
    messageElement.style.padding = '15px';
    messageElement.style.marginBottom = '20px';
    messageElement.style.borderRadius = '4px';
    
    if (type === 'error') {
        messageElement.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
        messageElement.style.border = '1px solid #e74c3c';
        messageElement.style.color = '#c0392b';
    } else if (type === 'success') {
        messageElement.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
        messageElement.style.border = '1px solid #2ecc71';
        messageElement.style.color = '#27ae60';
    }
    
    // Add to form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.prepend(messageElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}