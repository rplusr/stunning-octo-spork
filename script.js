// Carrier detection patterns and information
const carriers = {
    ups: {
        name: 'UPS',
        patterns: [
            /^1Z[0-9A-Z]{16}$/i, // Standard UPS tracking number
            /^T\d{10}$/i, // UPS Mail Innovations
            /^[0-9]{26}$/
        ],
        website: 'https://www.ups.com'
    },
    fedex: {
        name: 'FedEx',
        patterns: [
            /^\d{12}$/, // FedEx Express (12 digits)
            /^\d{15}$/, // FedEx Express (15 digits)
            /^\d{20}$/, // FedEx Ground
            /^96\d{20}$/ // FedEx SmartPost
        ],
        website: 'https://www.fedex.com'
    },
    usps: {
        name: 'USPS',
        patterns: [
            /^94\d{20}$/, // USPS Priority Mail
            /^92\d{20}$/, // USPS Parcel Select
            /^93\d{20}$/, // USPS Parcel Select Lightweight
            /^82\d{8}$/, // USPS Express Mail
            /^[A-Z]{2}\d{9}US$/i // International format
        ],
        website: 'https://www.usps.com'
    },
    dhl: {
        name: 'DHL',
        patterns: [
            /^\d{10,11}$/, // DHL Express
            /^[A-Z]{3}\d{7}$/, // DHL eCommerce
            /^\d{12}$/ // DHL Parcel
        ],
        website: 'https://www.dhl.com'
    },
    royalMail: {
        name: 'Royal Mail',
        patterns: [
            /^[A-Z]{2}\d{9}GB$/i, // International
            /^[A-Z]{2}\d{7}$/i // Domestic
        ],
        website: 'https://www.royalmail.com'
    },
    canadaPost: {
        name: 'Canada Post',
        patterns: [
            /^\d{16}$/, // Domestic
            /^[A-Z]{2}\d{9}CA$/i // International
        ],
        website: 'https://www.canadapost.ca'
    },
    australiaPost: {
        name: 'Australia Post',
        patterns: [
            /^[A-Z]{2}\d{9}AU$/i, // International
            /^\d{13}$/ // Domestic
        ],
        website: 'https://auspost.com.au'
    },
    chinaPost: {
        name: 'China Post',
        patterns: [
            /^[A-Z]{2}\d{9}CN$/i, // International
            /^\d{13}$/ // Domestic
        ],
        website: 'http://www.chinapost.com.cn'
    },
    japanPost: {
        name: 'Japan Post',
        patterns: [
            /^[A-Z]{2}\d{9}JP$/i, // International
            /^\d{12,14}$/ // Domestic
        ],
        website: 'https://www.post.japanpost.jp'
    },
    deutschePost: {
        name: 'Deutsche Post DHL',
        patterns: [
            /^[A-Z]{2}\d{9}DE$/i, // International
            /^\d{12,16}$/ // Domestic
        ],
        website: 'https://www.deutschepost.de'
    },
    laPoste: {
        name: 'La Poste',
        patterns: [
            /^[A-Z]{2}\d{9}FR$/i, // International
            /^\d{13}$/ // Domestic
        ],
        website: 'https://www.laposte.fr'
    },
    correos: {
        name: 'Correos',
        patterns: [
            /^[A-Z]{2}\d{9}ES$/i, // International
            /^\d{13}$/ // Domestic
        ],
        website: 'https://www.correos.es'
    }
};

// Detect carrier from tracking number
function detectCarrier(trackingNumber) {
    const cleanedNumber = trackingNumber.trim().toUpperCase();

    for (const [key, carrier] of Object.entries(carriers)) {
        for (const pattern of carrier.patterns) {
            if (pattern.test(cleanedNumber)) {
                return carrier;
            }
        }
    }

    return null;
}

// Generate mock tracking data based on carrier
function generateTrackingData(trackingNumber, carrier) {
    const statuses = [
        'Order Processed',
        'Picked Up',
        'In Transit',
        'Out for Delivery',
        'Delivered'
    ];

    const locations = {
        'UPS': ['Louisville, KY', 'Chicago, IL', 'New York, NY'],
        'FedEx': ['Memphis, TN', 'Indianapolis, IN', 'Boston, MA'],
        'USPS': ['Los Angeles, CA', 'Denver, CO', 'Miami, FL'],
        'DHL': ['Cincinnati, OH', 'Atlanta, GA', 'Seattle, WA'],
        'Royal Mail': ['London, UK', 'Birmingham, UK', 'Manchester, UK'],
        'Canada Post': ['Toronto, ON', 'Montreal, QC', 'Vancouver, BC'],
        'Australia Post': ['Sydney, NSW', 'Melbourne, VIC', 'Brisbane, QLD'],
        'China Post': ['Beijing', 'Shanghai', 'Guangzhou'],
        'Japan Post': ['Tokyo', 'Osaka', 'Nagoya'],
        'Deutsche Post DHL': ['Frankfurt', 'Berlin', 'Munich'],
        'La Poste': ['Paris', 'Lyon', 'Marseille'],
        'Correos': ['Madrid', 'Barcelona', 'Valencia']
    };

    const carrierLocations = locations[carrier.name] || ['Distribution Center', 'Regional Hub', 'Local Facility'];

    // Generate timeline events
    const timeline = [];
    const currentDate = new Date();

    // Generate 4-6 tracking events
    const numEvents = Math.floor(Math.random() * 3) + 4;
    const selectedStatuses = statuses.slice(0, numEvents);

    for (let i = 0; i < selectedStatuses.length; i++) {
        const daysAgo = selectedStatuses.length - i - 1;
        const eventDate = new Date(currentDate);
        eventDate.setDate(eventDate.getDate() - daysAgo);

        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        eventDate.setHours(hours, minutes, 0);

        timeline.push({
            status: selectedStatuses[i],
            location: carrierLocations[Math.min(i, carrierLocations.length - 1)],
            date: eventDate,
            isCurrent: i === selectedStatuses.length - 1
        });
    }

    // Generate package info
    const packageInfo = {
        weight: `${(Math.random() * 10 + 1).toFixed(2)} kg`,
        dimensions: `${Math.floor(Math.random() * 30 + 10)} x ${Math.floor(Math.random() * 30 + 10)} x ${Math.floor(Math.random() * 30 + 10)} cm`,
        estimatedDelivery: formatDate(new Date(currentDate.getTime() + (Math.random() * 2 + 1) * 24 * 60 * 60 * 1000)),
        service: ['Express', 'Standard', 'Economy', 'Priority'][Math.floor(Math.random() * 4)]
    };

    return {
        trackingNumber,
        carrier: carrier.name,
        timeline,
        packageInfo,
        currentStatus: timeline[timeline.length - 1].status
    };
}

// Format date for display
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Display tracking results
function displayResults(data) {
    // Update tracking number and carrier
    document.getElementById('displayTrackingNumber').textContent = data.trackingNumber;
    document.getElementById('displayCarrier').textContent = data.carrier;

    // Update status overview
    const statusTitle = document.getElementById('statusTitle');
    const statusDescription = document.getElementById('statusDescription');
    const statusIcon = document.getElementById('statusIcon');

    statusTitle.textContent = data.currentStatus;
    statusDescription.textContent = `Last updated: ${formatDate(data.timeline[data.timeline.length - 1].date)}`;

    // Update status icon and color based on status
    const statusOverview = document.querySelector('.status-overview');
    if (data.currentStatus === 'Delivered') {
        statusOverview.style.background = 'linear-gradient(135deg, #f0fdf4, #dcfce7)';
        statusOverview.style.borderColor = '#86efac';
        statusIcon.style.background = '#10b981';
        statusIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    } else if (data.currentStatus === 'Out for Delivery') {
        statusOverview.style.background = 'linear-gradient(135deg, #fefce8, #fef9c3)';
        statusOverview.style.borderColor = '#fde047';
        statusIcon.style.background = '#f59e0b';
        statusIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    } else {
        statusOverview.style.background = 'linear-gradient(135deg, #eff6ff, #dbeafe)';
        statusOverview.style.borderColor = '#93c5fd';
        statusIcon.style.background = '#3b82f6';
        statusIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M16 8L20 10.5V17.5L16 20V8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
        `;
    }

    // Build timeline
    const timelineContainer = document.getElementById('timelineContainer');
    timelineContainer.innerHTML = '';

    data.timeline.forEach((event, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item' + (event.isCurrent ? ' current' : '');
        timelineItem.style.animationDelay = `${index * 0.1}s`;

        timelineItem.innerHTML = `
            <div class="timeline-date">${formatDate(event.date)}</div>
            <div class="timeline-status">${event.status}</div>
            <div class="timeline-location">${event.location}</div>
        `;

        timelineContainer.appendChild(timelineItem);
    });

    // Build package info
    const packageInfoContainer = document.getElementById('packageInfo');
    packageInfoContainer.innerHTML = '';

    const infoItems = [
        { label: 'Service Type', value: data.packageInfo.service },
        { label: 'Weight', value: data.packageInfo.weight },
        { label: 'Dimensions', value: data.packageInfo.dimensions },
        { label: 'Estimated Delivery', value: data.packageInfo.estimatedDelivery }
    ];

    infoItems.forEach(item => {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';
        infoItem.innerHTML = `
            <span class="info-label">${item.label}</span>
            <span class="info-value">${item.value}</span>
        `;
        packageInfoContainer.appendChild(infoItem);
    });

    // Show results section
    document.getElementById('resultsSection').classList.remove('hidden');

    // Scroll to results
    setTimeout(() => {
        document.getElementById('resultsSection').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

// Handle tracking form submission
function handleTracking() {
    const trackingInput = document.getElementById('trackingInput');
    const trackingNumber = trackingInput.value.trim();
    const carrierInfo = document.getElementById('carrierInfo');

    if (!trackingNumber) {
        carrierInfo.innerHTML = '<span style="color: #ef4444;">⚠ Please enter a tracking number</span>';
        return;
    }

    // Detect carrier
    const carrier = detectCarrier(trackingNumber);

    if (!carrier) {
        carrierInfo.innerHTML = `
            <span style="color: #f59e0b;">⚠ Could not detect carrier from tracking number.</span><br>
            <span style="color: #6b7280;">Please check the format and try again. Supported formats include UPS (1Z...), FedEx (12-20 digits), USPS (20-22 digits), and international tracking numbers.</span>
        `;
        return;
    }

    // Show detected carrier
    carrierInfo.innerHTML = `
        <span style="color: #10b981;">✓ Detected carrier: <strong>${carrier.name}</strong></span><br>
        <span style="color: #6b7280;">Retrieving tracking information...</span>
    `;

    // Simulate API delay
    setTimeout(() => {
        const trackingData = generateTrackingData(trackingNumber, carrier);
        displayResults(trackingData);
        carrierInfo.innerHTML = '';
    }, 1000);
}

// Handle new tracking button
function handleNewTracking() {
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('trackingInput').value = '';
    document.getElementById('carrierInfo').innerHTML = '';

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const trackButton = document.getElementById('trackButton');
    const trackingInput = document.getElementById('trackingInput');
    const newTrackingButton = document.getElementById('newTrackingButton');

    trackButton.addEventListener('click', handleTracking);

    trackingInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleTracking();
        }
    });

    newTrackingButton.addEventListener('click', handleNewTracking);

    // Auto-detect carrier as user types
    trackingInput.addEventListener('input', (e) => {
        const trackingNumber = e.target.value.trim();
        const carrierInfo = document.getElementById('carrierInfo');

        if (trackingNumber.length > 5) {
            const carrier = detectCarrier(trackingNumber);
            if (carrier) {
                carrierInfo.innerHTML = `<span style="color: #10b981;">✓ Detected: <strong>${carrier.name}</strong></span>`;
            } else {
                carrierInfo.innerHTML = '';
            }
        } else {
            carrierInfo.innerHTML = '';
        }
    });
});

// Example tracking numbers for testing (displayed in console)
console.log('Example tracking numbers for testing:');
console.log('UPS: 1Z999AA10123456784');
console.log('FedEx: 123456789012');
console.log('USPS: 9400111899562843678599');
console.log('DHL: 1234567890');
console.log('Royal Mail: AB123456789GB');
console.log('Canada Post: 1234567890123456');
console.log('Australia Post: AB123456789AU');
console.log('China Post: AB123456789CN');
