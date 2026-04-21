document.addEventListener('DOMContentLoaded', function() {
    const calendarDiv = document.getElementById('calendar');
    if (calendarDiv) {
        initCalendar();
    }
    
    function initCalendar() {
        const today = new Date();
        const calendarDiv = document.getElementById('calendar');
        const selectedDateInput = document.getElementById('selectedDate');
        const timeSlotsDiv = document.getElementById('timeSlots');
        
        let selectedDate = null;
        let selectedTimeElem = null;
        
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
                selectedDate = this.dataset.date;
                selectedDateInput.value = selectedDate;
                
                generateTimeSlots(selectedDate);
            });
            
            calendarDiv.appendChild(dayElem);
        }
        
        function generateTimeSlots(date) {
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
    }
    
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateAppointmentForm()) {
                alert('✅ Запись успешно создана!\n\nМы отправили подтверждение на ваш телефон.\nЖдём вас в клинике!');
                appointmentForm.reset();
                document.querySelectorAll('.calendar-day.selected').forEach(d => d.classList.remove('selected'));
                document.querySelectorAll('.time-slot.selected').forEach(t => t.classList.remove('selected'));
                document.getElementById('selectedDate').value = '';
                document.getElementById('selectedTime').value = '';
            }
        });
    }
    
    function validateAppointmentForm() {
        let isValid = true;
        const errors = [];
        
        const service = document.getElementById('service')?.value;
        if (!service) {
            errors.push('Выберите услугу');
            isValid = false;
        }
        
        const date = document.getElementById('selectedDate')?.value;
        if (!date) {
            errors.push('Выберите дату');
            isValid = false;
        }
        
        const time = document.getElementById('selectedTime')?.value;
        if (!time) {
            errors.push('Выберите время');
            isValid = false;
        }
        
        const ownerName = document.getElementById('ownerName')?.value.trim();
        if (!ownerName || ownerName.length < 2) {
            errors.push('Введите корректное имя');
            isValid = false;
        }
        
        const phone = document.getElementById('phone')?.value.trim();
        const phoneRegex = /^\+7\s?\(?[0-9]{3}\)?\s?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$/;
        if (!phoneRegex.test(phone) && phone.length < 10) {
            errors.push('Введите номер телефона в формате +7 (XXX) XXX-XX-XX');
            isValid = false;
        }
        
        const petName = document.getElementById('petName')?.value.trim();
        if (!petName) {
            errors.push('Введите имя питомца');
            isValid = false;
        }
        
        if (!isValid) {
            alert('Пожалуйста, исправьте ошибки:\n- ' + errors.join('\n- '));
        }
        
        return isValid;
    }
    
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('fbName')?.value.trim();
            const contact = document.getElementById('fbContact')?.value.trim();
            const subject = document.getElementById('fbSubject')?.value.trim();
            const message = document.getElementById('fbMessage')?.value.trim();
            
            if (!name || !contact || !subject || !message) {
                alert('❌ Пожалуйста, заполните все поля');
                return;
            }
            
            alert('✅ Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
            feedbackForm.reset();
        });
    }
    
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
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
    });
    
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });
});