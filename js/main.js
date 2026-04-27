document.addEventListener('DOMContentLoaded', function() {
    
    let currentStep = 1;
    const totalSteps = 3;
    
    const steps = document.querySelectorAll('.step');
    const stepGroups = document.querySelectorAll('.step-group');
    
    function updateStepDisplay() {
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum < currentStep) {
                step.classList.add('completed');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
            }
        });
        
        stepGroups.forEach(group => {
            const groupStep = parseInt(group.dataset.step);
            if (groupStep === currentStep) {
                group.style.display = 'block';
                group.classList.add('active');
            } else {
                group.style.display = 'none';
                group.classList.remove('active');
            }
        });
        
        addNavigationButtons();
    }
    
    function addNavigationButtons() {
        const currentGroup = document.querySelector(`.step-group[data-step="${currentStep}"]`);
        if (!currentGroup) return;
        
        const oldButtons = currentGroup.querySelector('.step-buttons');
        if (oldButtons) oldButtons.remove();
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'step-buttons';
        
        if (currentStep > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.type = 'button';
            prevBtn.className = 'btn-secondary';
            prevBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Назад';
            prevBtn.onclick = () => {
                currentStep--;
                updateStepDisplay();
            };
            buttonsDiv.appendChild(prevBtn);
        }
        
        if (currentStep < totalSteps) {
            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.className = 'btn-primary';
            nextBtn.innerHTML = 'Далее <i class="fas fa-arrow-right"></i>';
            nextBtn.onclick = () => {
                if (validateCurrentStep()) {
                    currentStep++;
                    updateStepDisplay();
                }
            };
            buttonsDiv.appendChild(nextBtn);
        } else {
            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.className = 'submit-btn';
            submitBtn.innerHTML = 'Подтвердить запись <i class="fas fa-check"></i>';
            buttonsDiv.appendChild(submitBtn);
        }
        
        currentGroup.appendChild(buttonsDiv);
    }
    
    function validateCurrentStep() {
        const currentGroup = document.querySelector(`.step-group[data-step="${currentStep}"]`);
        if (!currentGroup) return true;
        
        const requiredFields = currentGroup.querySelectorAll('[required]');
        const errors = [];
        
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                field.style.borderColor = '#e06888';
                errors.push(field.previousElementSibling?.innerText || 'Заполните поле');
            } else {
                field.style.borderColor = '#e2ecef';
            }
        }
        
        if (currentStep === 2) {
            const selectedDate = document.getElementById('selectedDate')?.value;
            const selectedTime = document.getElementById('selectedTime')?.value;
            if (!selectedDate) errors.push('Выберите дату');
            if (!selectedTime) errors.push('Выберите время');
        }
        
        if (errors.length > 0) {
            alert('⚠️ Пожалуйста, заполните все обязательные поля:\n- ' + errors.join('\n- '));
            return false;
        }
        return true;
    }
    
    function initCalendar() {
        const calendarDiv = document.getElementById('calendar');
        if (!calendarDiv) return;
        
        calendarDiv.innerHTML = '';
        const today = new Date();
        const selectedDateInput = document.getElementById('selectedDate');
        
        const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        weekdays.forEach(day => {
            const dayElem = document.createElement('div');
            dayElem.className = 'calendar-weekday';
            dayElem.textContent = day;
            calendarDiv.appendChild(dayElem);
        });
        
        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            
            const dayElem = document.createElement('div');
            dayElem.className = 'calendar-day available';
            dayElem.textContent = date.getDate();
            dayElem.dataset.date = date.toISOString().split('T')[0];
            
            if (date.getDay() === 0 || date.getDay() === 6) {
                dayElem.classList.add('unavailable');
                dayElem.classList.remove('available');
            }
            
            dayElem.addEventListener('click', function() {
                if (this.classList.contains('unavailable')) return;
                
                document.querySelectorAll('.calendar-day').forEach(d => {
                    d.classList.remove('selected');
                });
                
                this.classList.add('selected');
                selectedDateInput.value = this.dataset.date;
                generateTimeSlots(this.dataset.date);
            });
            
            calendarDiv.appendChild(dayElem);
        }
    }
    
    function generateTimeSlots(date) {
        const timeSlotsDiv = document.getElementById('timeSlots');
        if (!timeSlotsDiv) return;
        
        timeSlotsDiv.innerHTML = '';
        const slots = ['09:00', '10:00', '11:00', '12:00', '13:00', 
                       '14:00', '15:00', '16:00', '17:00', '18:00'];
        
        slots.forEach(time => {
            const slotElem = document.createElement('div');
            slotElem.className = 'time-slot';
            slotElem.textContent = time;
            slotElem.addEventListener('click', function() {
                document.querySelectorAll('.time-slot').forEach(s => {
                    s.classList.remove('selected');
                });
                this.classList.add('selected');
                document.getElementById('selectedTime').value = time;
            });
            timeSlotsDiv.appendChild(slotElem);
        });
    }
    
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const service = document.getElementById('service')?.value;
            const date = document.getElementById('selectedDate')?.value;
            const time = document.getElementById('selectedTime')?.value;
            const ownerName = document.getElementById('ownerName')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            const petName = document.getElementById('petName')?.value.trim();
            
            const errors = [];
            if (!service) errors.push('Выберите услугу');
            if (!date) errors.push('Выберите дату');
            if (!time) errors.push('Выберите время');
            if (!ownerName) errors.push('Введите ваше имя');
            if (!phone) errors.push('Введите телефон');
            if (!petName) errors.push('Введите имя питомца');
            
            if (errors.length > 0) {
                alert('⚠️ Пожалуйста, исправьте ошибки:\n- ' + errors.join('\n- '));
                return;
            }
            
            const formData = new FormData();
            formData.append('service', service);
            formData.append('date', date);
            formData.append('time', time);
            formData.append('ownerName', ownerName);
            formData.append('phone', phone);
            formData.append('petName', petName);
            formData.append('breed', document.getElementById('breed')?.value || '');
            formData.append('comment', document.getElementById('comment')?.value || '');
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('php/send-appointment.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('✅ Запись успешно создана!\n\nМы свяжемся с вами для подтверждения.\nЖдём вас в клинике!');
                    form.reset();
                    document.getElementById('selectedDate').value = '';
                    document.getElementById('selectedTime').value = '';
                    document.querySelectorAll('.calendar-day.selected').forEach(d => d.classList.remove('selected'));
                    document.querySelectorAll('.time-slot.selected').forEach(t => t.classList.remove('selected'));
                    currentStep = 1;
                    updateStepDisplay();
                } else {
                    alert('❌ Ошибка: ' + result.message);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('❌ Ошибка соединения. Проверьте, запущен ли Apache в XAMPP.\n\nПодробнее: ' + error.message);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length >= 1) {
                let formatted = '+7';
                if (value.length > 1) formatted += ' (' + value.slice(1, 4);
                if (value.length >= 4) formatted += ') ' + value.slice(4, 7);
                if (value.length >= 7) formatted += '-' + value.slice(7, 9);
                if (value.length >= 9) formatted += '-' + value.slice(9, 11);
                this.value = formatted;
            } else {
                this.value = '';
            }
        });
    }
    
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });
    
    initCalendar();
    updateStepDisplay();
    
    steps.forEach(step => {
        step.addEventListener('click', () => {
            const targetStep = parseInt(step.dataset.step);
            if (targetStep < currentStep) {
                currentStep = targetStep;
                updateStepDisplay();
            } else if (targetStep > currentStep) {
                if (validateCurrentStep()) {
                    currentStep = targetStep;
                    updateStepDisplay();
                }
            }
        });
    });
});