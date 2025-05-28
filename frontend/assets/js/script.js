$(document).ready(function () {
    let currentStep = 1;
    let formData = {};

    // Role-specific configurations
    const roleConfigs = {
        'Interior Designer': {
            designObjects: [
                { name: 'Master Bed', icon: 'fas fa-bed' },
                { name: 'Living Room', icon: 'fas fa-tv' },
                { name: 'Guest Room', icon: 'fas fa-bed' },
                { name: 'Washroom', icon: 'fas fa-bath' },
                { name: 'Attic', icon: 'fas fa-home' },
                { name: 'Reading Room', icon: 'fas fa-book' },
                { name: 'Garage', icon: 'fas fa-car' },
                { name: 'Garden', icon: 'fas fa-leaf' },
                { name: 'Prayer Room', icon: 'fas fa-pray' },
                { name: 'Media Room', icon: 'fas fa-video' }
            ],
            parameters: [
                { id: 'width', label: 'Width (meters)', type: 'number', step: '0.1', required: true },
                { id: 'length', label: 'Length (meters)', type: 'number', step: '0.1', required: true },
                { id: 'style', label: 'Style', type: 'select', options: ['Luxury', 'Elegance', 'Retro', 'Classic', 'Minimal', 'Futuristic'], required: true },
                { id: 'preferences', label: 'Additional Preferences', type: 'textarea', placeholder: 'E.g., Cozy lighting, wooden textures', required: false }
            ]
        },
        'Furniture Designer': {
            designObjects: [
                { name: 'Sofa/Couch', icon: 'fas fa-couch' },
                { name: 'Bed', icon: 'fas fa-bed' },
                { name: 'Reading Table', icon: 'fas fa-book' },
                { name: 'Dining Table', icon: 'fas fa-utensils' },
                { name: 'Tea Table', icon: 'fas fa-coffee' }
            ],
            parameters: [
                { id: 'material', label: 'Materials', type: 'multiselect', options: ['Foam', 'Leather', 'Wood', 'Fabric', 'Metal'], required: true },
                { id: 'width', label: 'Width (meters)', type: 'number', step: '0.1', required: true },
                { id: 'length', label: 'Length (meters)', type: 'number', step: '0.1', required: true },
                { id: 'capacity', label: 'Capacity (seats/people)', type: 'number', step: '1', required: true },
                { id: 'style', label: 'Style', type: 'select', options: ['Modern', 'Rustic', 'Vintage', 'Contemporary', 'Minimal'], required: true },
                { id: 'preferences', label: 'Additional Preferences', type: 'textarea', placeholder: 'E.g., Soft cushions, dark finish', required: false }
            ]
        },
        'Artifact Designer': {
            designObjects: [
                { name: 'Wall Painting', icon: 'fas fa-paint-roller' },
                { name: 'Flower Vase', icon: 'fas fa-fan' },
                { name: 'Lamp', icon: 'fas fa-lightbulb' }
            ],
            parameters: [
                { id: 'medium', label: 'Mediums', type: 'multiselect', options: ['Oil', 'Acrylic', 'Ceramic', 'Glass', 'Metal'], required: true },
                { id: 'width', label: 'Width (cm)', type: 'number', step: '1', required: true },
                { id: 'height', label: 'Height (cm)', type: 'number', step: '1', required: true },
                { id: 'theme', label: 'Theme', type: 'select', options: ['Abstract', 'Nature', 'Modern', 'Cultural', 'Vintage'], required: true },
                { id: 'preferences', label: 'Additional Preferences', type: 'textarea', placeholder: 'E.g., Bright colors, minimalist design', required: false }
            ]
        }
    };

    // Initialize bootstrap-select
    function initializeSelectPicker() {
        $('.selectpicker').selectpicker({
            style: 'btn glass-input',
            styleBase: 'btn',
            size: 5,
            noneSelectedText: 'Select options',
            selectAllText: 'Select All',
            deselectAllText: 'Deselect All'
        });
    }

    // GSAP Animations
    gsap.from("#logo", { opacity: 0, y: -50, duration: 1, ease: "bounce" });
    gsap.from("#main-logo", { opacity: 0, y: -50, duration: 1, ease: "bounce", delay: 0.2 });
    gsap.from(".glass-card", { opacity: 0, scale: 0.8, stagger: 0.2, duration: 0.8, delay: 0.5 });
    gsap.from(".progress", { width: 0, duration: 1, ease: "power2.out", delay: 1 });

    // Update progress bar
    function updateProgress() {
        const progress = (currentStep / 4) * 100;
        $('#progress-bar').css('width', `${progress}%`);
    }

    // Show specific step
    function showStep(step) {
        $('.step').addClass('d-none').removeClass('animate__animated animate__fadeIn');
        $(`#step-${step}`).removeClass('d-none').addClass('animate__animated animate__fadeIn');
        currentStep = step;
        updateProgress();
        gsap.from(`#step-${step} .glass-card`, { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 });
    }

    // Render design objects for Step 2
    function renderDesignObjects(role) {
        const objects = roleConfigs[role].designObjects;
        $('#design-objects').empty();
        objects.forEach(obj => {
            $('#design-objects').append(`
                <div class="col-md-3">
                    <div class="card h-100 text-center glass-card hover-card">
                        <div class="card-body">
                            <i class="${obj.icon} fa-2x mb-3 text-teal"></i>
                            <h5>${obj.name}</h5>
                            <button class="btn btn-outline-teal mt-2 select-object" data-object="${obj.name}">Select</button>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // Render parameters for Step 3
    function renderParameters(role) {
        const params = roleConfigs[role].parameters;
        $('#parameters').empty();
        params.forEach(param => {
            let inputHtml = '';
            if (param.type === 'number') {
                inputHtml = `
                    <input type="number" class="form-control glass-input" id="${param.id}" step="${param.step}" ${param.required ? 'required' : ''}>
                `;
            } else if (param.type === 'select') {
                inputHtml = `
                    <select class="form-select glass-input" id="${param.id}" ${param.required ? 'required' : ''}>
                        <option value="" disabled selected>Select ${param.label}</option>
                        ${param.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                `;
            } else if (param.type === 'multiselect') {
                inputHtml = `
                    <select class="selectpicker glass-input" id="${param.id}" multiple data-live-search="true" ${param.required ? 'required' : ''}>
                        ${param.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                `;
            } else if (param.type === 'textarea') {
                inputHtml = `
                    <textarea class="form-control glass-input" id="${param.id}" rows="4" placeholder="${param.placeholder}"></textarea>
                `;
            }
            $('#parameters').append(`
                <div class="col-md-6">
                    <label for="${param.id}" class="form-label">${param.label}</label>
                    ${inputHtml}
                </div>
            `);
        });
        initializeSelectPicker();
    }

    // Render review parameters for Step 4
    function renderReviewParameters() {
        const params = roleConfigs[formData.role].parameters;
        $('#review-parameters').empty();
        params.forEach(param => {
            if (param.id !== 'preferences') {
                const value = formData[param.id];
                let displayValue = Array.isArray(value) ? (value.length > 0 ? value.join(', ') : 'Not set') : (value || 'Not set');
                if (param.id === 'width' || param.id === 'length') {
                    displayValue = value ? `${value} ${param.id === 'width' && formData.role === 'Artifact Designer' ? 'cm' : 'meters'}` : 'Not set';
                } else if (param.id === 'height') {
                    displayValue = value ? `${value} cm` : 'Not set';
                } else if (param.id === 'capacity') {
                    displayValue = value ? `${value} seats/people` : 'Not set';
                }
                $('#review-parameters').append(`
                    <p><strong>${param.label}:</strong> <span id="review-${param.id}">${displayValue}</span></p>
                `);
            }
        });
    }

    // Render output parameters for Step 4
    function renderOutputParameters() {
        const params = roleConfigs[formData.role].parameters;
        $('#output-parameters').empty();
        params.forEach(param => {
            if (param.id !== 'preferences') {
                const value = formData[param.id];
                let displayValue = Array.isArray(value) ? (value.length > 0 ? value.join(', ') : 'Not set') : (value || 'Not set');
                if (param.id === 'width' || param.id === 'length') {
                    displayValue = value ? `${value} ${param.id === 'width' && formData.role === 'Artifact Designer' ? 'cm' : 'meters'}` : 'Not set';
                } else if (param.id === 'height') {
                    displayValue = value ? `${value} cm` : 'Not set';
                } else if (param.id === 'capacity') {
                    displayValue = value ? `${value} seats/people` : 'Not set';
                }
                $('#output-parameters').append(`
                    <p><strong>${param.label}:</strong> <span id="output-${param.id}">${displayValue}</span></p>
                `);
            }
        });
    }

    // Role selection
    $('.select-role').click(function () {
        formData.role = $(this).data('role');
        renderDesignObjects(formData.role);
        showStep(2);
    });

    // Object selection
    $(document).on('click', '.select-object', function () {
        formData.design_object = $(this).data('object');
        renderParameters(formData.role);
        showStep(3);
    });

    // Previous step
    $('.prev-step').click(function () {
        showStep(currentStep - 1);
    });

    // Form submission for parameters
    $('#params-form').submit(function (e) {
        e.preventDefault();
        const params = roleConfigs[formData.role].parameters;
        params.forEach(param => {
            if (param.type === 'multiselect') {
                formData[param.id] = $(`#${param.id}`).val() || [];
            } else {
                const value = $(`#${param.id}`).val();
                formData[param.id] = param.type === 'number' ? parseFloat(value) || value : value;
            }
        });

        // Update review step
        $('#review-role').text(formData.role || 'Not selected');
        $('#review-object').text(formData.design_object || 'Not selected');
        $('#review-preferences').text(formData.preferences || 'None');
        renderReviewParameters();

        showStep(4);
    });

    // Generate design idea
    $('#generate-btn').click(function () {
        // Validate required fields
        const requiredParams = roleConfigs[formData.role].parameters.filter(p => p.required);
        const missing = requiredParams.some(param => {
            const value = formData[param.id];
            return !value || (Array.isArray(value) && value.length === 0) || value === '';
        });
        if (!formData.role || !formData.design_object || missing) {
            $('#loader').addClass('d-none');
            $('#generated-output').removeClass('d-none').addClass('animate__animated animate__fadeIn');
            $('#output-idea').text('Error: Please complete all required steps and parameters.');
            $('#generate-btn').prop('disabled', false);
            return;
        }

        $(this).prop('disabled', true);
        $('#loader').removeClass('d-none');
        gsap.to(this, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });

        // Prepare payload with parameters dictionary
        const payload = {
            role: formData.role,
            design_object: formData.design_object,
            parameters: {},
            preferences: formData.preferences || 'None'
        };
        roleConfigs[formData.role].parameters.forEach(param => {
            if (param.id !== 'preferences') {
                payload.parameters[param.id] = formData[param.id];
            }
        });

        // Log payload for debugging
        console.log('Sending payload:', JSON.stringify(payload));

        // Send API request
        $.ajax({
            url: '/api/generate-design',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function(response) {
                $('#loader').addClass('d-none');
                $('#generated-output').removeClass('d-none').addClass('animate__animated animate__fadeIn');

                $('#output-role').text(formData.role);
                $('#output-object').text(formData.design_object);
                $('#output-preferences').text(formData.preferences || 'None');
                renderOutputParameters();
                $('#output-idea').text(response.design_idea);

                gsap.from("#generated-output", { opacity: 0, y: 50, duration: 1 });
                $('#generate-btn').prop('disabled', false);
            },
            error: function(xhr) {
                $('#loader').addClass('d-none');
                $('#generated-output').removeClass('d-none').addClass('animate__animated animate__fadeIn');
                $('#output-idea').text('Error generating design: ' + (xhr.responseJSON?.message || 'Unknown error'));
                $('#generate-btn').prop('disabled', false);
            }
        });
    });
});