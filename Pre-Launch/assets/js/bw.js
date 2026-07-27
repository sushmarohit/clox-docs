  // Simulate loading process
        window.addEventListener('load', function() {
            // Force form reset on page load to clear any cached inputs
            const form = document.getElementById('preLaunchForm');
            if(form) form.reset();
            
            // Remove selection state from infra cards just in case
            document.querySelectorAll('.infra-card').forEach(card => card.classList.remove('selected'));
            const submitBtn = document.getElementById('finalSubmitBtn');
            if(submitBtn) submitBtn.setAttribute('disabled', 'disabled');

            setTimeout(function() {
                const loader = document.getElementById('loader-wrapper');
                const mainContent = document.getElementById('main-content');
                
                loader.classList.add('fade-out');
                
                setTimeout(() => {
                    loader.style.display = 'none';
                    mainContent.style.display = 'flex'; // Changed to flex for app layout
                    mainContent.classList.add('fade-in');
                }, 600); // Wait for fade-out CSS animation
            }, 2000); // 2s loading time for app feel
        });

        // Form Logic
        function updateIndicator(step) {
            document.querySelectorAll('.step').forEach(el => el.classList.remove('active', 'completed'));
            if(step >= 1) {
                const s1 = document.getElementById('indicator-step1');
                if (s1) s1.classList.add(step > 1 ? 'completed' : 'active');
            }
            if(step >= 2) {
                const s2 = document.getElementById('indicator-step2');
                if (s2) s2.classList.add(step > 2 ? 'completed' : 'active');
            }
            if(step >= 3) {
                const s3 = document.getElementById('indicator-step3');
                if (s3) s3.classList.add('active');
            }
        }

        function showStep2() {
            const userTypeInput = document.querySelector('input[name="userType"]:checked');
            if (!userTypeInput) return; // Wait for user to select an option
            const userType = userTypeInput.value;
            const step1 = document.getElementById('step1');
            const step2 = document.getElementById('step2');
            const step3 = document.getElementById('step3');
            const senderFields = document.getElementById('senderFields');
            const carrierFields = document.getElementById('carrierFields');
            const step2Title = document.getElementById('step2Title');

            step1.style.display = 'none';
            if (step3) step3.style.display = 'none';
            
            step2.style.display = 'block';
            step2.classList.add('fade-in');

            // Manage required fields dynamically based on selection
            const senderReqs = document.querySelectorAll('.sender-req');
            const carrierReqs = document.querySelectorAll('.carrier-req');

            if (userType === 'sender') {
                senderFields.style.display = 'block';
                carrierFields.style.display = 'none';
                step2Title.innerText = 'Sender Details';
                senderReqs.forEach(el => el.setAttribute('required', 'required'));
                carrierReqs.forEach(el => el.removeAttribute('required'));
            } else {
                senderFields.style.display = 'none';
                carrierFields.style.display = 'flex';
                step2Title.innerText = 'Carrier Details';
                senderReqs.forEach(el => el.removeAttribute('required'));
                carrierReqs.forEach(el => el.setAttribute('required', 'required'));
            }
            
            updateIndicator(2);
        }

        function showStep1() {
            document.getElementById('step2').style.display = 'none';
            if(document.getElementById('step3')) document.getElementById('step3').style.display = 'none';
            document.getElementById('step1').style.display = 'block';
            document.getElementById('step1').classList.add('fade-in');
            
            const radios = document.querySelectorAll('input[name="userType"]');
            radios.forEach(r => r.checked = false);
            
            updateIndicator(1);
        }

        function showStep3() {
            const form = document.getElementById('preLaunchForm');
            
            // Custom validation for checkbox group (Sender only)
            const userType = document.querySelector('input[name="userType"]:checked').value;
            let checkboxValid = true;
            if (userType === 'sender') {
                const checkboxes = document.querySelectorAll('.sender-req-checkbox');
                const isChecked = Array.from(checkboxes).some(cb => cb.checked);
                const feedback = document.getElementById('omFeedback');
                if (!isChecked) {
                    checkboxValid = false;
                    if (feedback) feedback.style.display = 'block';
                } else {
                    if (feedback) feedback.style.display = 'none';
                }
            }

            if (!form.checkValidity() || !checkboxValid) {
                form.classList.add('was-validated');
                return;
            }

            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'block';
            document.getElementById('step3').classList.add('fade-in');
            
            updateIndicator(3);
        }

        function toggleInfra(element) {
            element.classList.toggle('selected');
            
            const selectedCards = document.querySelectorAll('.infra-card.selected');
            const submitBtn = document.getElementById('finalSubmitBtn');
            
            if (submitBtn) {
                if (selectedCards.length > 0) {
                    submitBtn.removeAttribute('disabled');
                } else {
                    submitBtn.setAttribute('disabled', 'disabled');
                }
            }
        }

        function submitFinal() {
            const btn = document.querySelector('button[onclick="submitFinal()"]');
            if(!btn) return;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Submitting...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                document.getElementById('finalSuccessMsg').style.display = 'block';
                document.getElementById('finalSuccessMsg').classList.add('fade-in');
            }, 1500);
        }
        function submitEOI() {
            const form = document.getElementById('eoiForm');
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            const btn = document.querySelector('button[onclick="submitEOI()"]');
            if(!btn) return;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Submitting...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                document.getElementById('eoiSuccessMsg').style.display = 'block';
                document.getElementById('eoiSuccessMsg').classList.add('fade-in');
            }, 1500);
        }

