// Checksum validation functions for tracking numbers
const checksumValidators = {
    // UPS uses Mod 10 check digit
    validateUPS: (trackingNumber) => {
        if (!trackingNumber.startsWith('1Z')) return false;

        // Remove 1Z prefix and extract check digit
        const number = trackingNumber.substring(2);
        if (number.length !== 16) return false;

        const checkDigit = number.charAt(15);
        const digits = number.substring(0, 15);

        // Convert letters to numbers (A=2, B=3, ..., Z=9, then repeat)
        let sum = 0;
        for (let i = 0; i < digits.length; i++) {
            let char = digits.charAt(i);
            let value;

            if (char >= '0' && char <= '9') {
                value = parseInt(char);
            } else {
                // Convert letter to number
                value = ((char.charCodeAt(0) - 65) % 10) + 2;
            }

            // Odd positions get doubled
            if (i % 2 === 0) {
                value *= 2;
            }
            sum += value;
        }

        const calculatedCheck = (10 - (sum % 10)) % 10;
        return checkDigit === calculatedCheck.toString() || checkDigit === String.fromCharCode(65 + calculatedCheck - 2);
    },

    // USPS uses Mod 10 check digit
    validateUSPS: (trackingNumber) => {
        // Only validate 20-22 digit tracking numbers
        if (trackingNumber.length < 20 || trackingNumber.length > 22) return true; // Skip validation for other formats
        if (!/^\d+$/.test(trackingNumber)) return true; // Skip if not all digits

        const checkDigit = parseInt(trackingNumber.charAt(trackingNumber.length - 1));
        const digits = trackingNumber.substring(0, trackingNumber.length - 1);

        let sum = 0;
        for (let i = 0; i < digits.length; i++) {
            let value = parseInt(digits.charAt(i));
            // Multiply odd positions (0-indexed) by 3
            if (i % 2 === 0) {
                value *= 3;
            }
            sum += value;
        }

        const calculatedCheck = (10 - (sum % 10)) % 10;
        return checkDigit === calculatedCheck;
    },

    // FedEx uses Mod 10 for most formats
    validateFedEx: (trackingNumber) => {
        // Only validate standard numeric formats
        if (!/^\d+$/.test(trackingNumber)) return true;
        if (trackingNumber.length !== 12 && trackingNumber.length !== 15) return true;

        const checkDigit = parseInt(trackingNumber.charAt(trackingNumber.length - 1));
        const digits = trackingNumber.substring(0, trackingNumber.length - 1);

        let sum = 0;
        let multiplier = 1;

        for (let i = digits.length - 1; i >= 0; i--) {
            let value = parseInt(digits.charAt(i)) * multiplier;
            sum += value;
            multiplier = multiplier === 1 ? 3 : 1;
        }

        const calculatedCheck = (10 - (sum % 10)) % 10;
        return checkDigit === calculatedCheck;
    }
};

// Carrier detection patterns and information
// Ordered from most specific to least specific to avoid false positives
const carriers = {
    ups: {
        name: 'UPS',
        patterns: [
            /^1Z[0-9A-Z]{16}$/i, // Standard UPS tracking number (starts with 1Z)
            /^T\d{10}$/i, // UPS Mail Innovations
            /^\d{26}$/ // UPS freight
        ],
        website: 'https://www.ups.com'
    },
    fedex: {
        name: 'FedEx',
        patterns: [
            /^96\d{20}$/,  // FedEx SmartPost (starts with 96)
            /^\d{15}$/,    // FedEx Express (15 digits)
            /^\d{12}$/,    // FedEx Express (12 digits)
            /^\d{20,22}$/  // FedEx Ground
        ],
        website: 'https://www.fedex.com'
    },
    usps: {
        name: 'USPS',
        patterns: [
            /^94\d{20,22}$/,       // USPS Priority Mail (starts with 94)
            /^92\d{20,22}$/,       // USPS Parcel Select (starts with 92)
            /^93\d{20,22}$/,       // USPS Parcel Select Lightweight (starts with 93)
            /^82\d{8}$/,           // USPS Express Mail (starts with 82)
            /^(94|92|93|82)\d+$/,  // Other USPS formats
            /^[A-Z]{2}\d{9}US$/i   // International format
        ],
        website: 'https://www.usps.com'
    },
    royalMail: {
        name: 'Royal Mail',
        patterns: [
            /^[A-Z]{2}\d{9}GB$/i,  // International
            /^[A-Z]{2}\d{7}$/i     // Domestic
        ],
        website: 'https://www.royalmail.com'
    },
    canadaPost: {
        name: 'Canada Post',
        patterns: [
            /^[A-Z]{2}\d{9}CA$/i,  // International
            /^\d{16}$/             // Domestic
        ],
        website: 'https://www.canadapost.ca'
    },
    australiaPost: {
        name: 'Australia Post',
        patterns: [
            /^[A-Z]{2}\d{9}AU$/i,              // International
            /^\d{2}[A-Z]{3}\d{16,18}$/i,       // Domestic barcode (e.g., 36YDB010108101000930806)
            /^\d{13}$/                          // Simple 13-digit domestic
        ],
        website: 'https://auspost.com.au'
    },
    chinaPost: {
        name: 'China Post',
        patterns: [
            /^[A-Z]{2}\d{9}CN$/i   // International
        ],
        website: 'http://www.chinapost.com.cn'
    },
    japanPost: {
        name: 'Japan Post',
        patterns: [
            /^[A-Z]{2}\d{9}JP$/i   // International
        ],
        website: 'https://www.post.japanpost.jp'
    },
    deutschePost: {
        name: 'Deutsche Post',
        patterns: [
            /^[A-Z]{2}\d{9}DE$/i   // International
        ],
        website: 'https://www.deutschepost.de'
    },
    laPoste: {
        name: 'La Poste',
        patterns: [
            /^[A-Z]{2}\d{9}FR$/i,  // International
            /^[0-9L]{13}$/         // Domestic (letters + numbers)
        ],
        website: 'https://www.laposte.fr'
    },
    correos: {
        name: 'Correos',
        patterns: [
            /^[A-Z]{2}\d{9}ES$/i   // International
        ],
        website: 'https://www.correos.es'
    },
    dhl: {
        name: 'DHL',
        patterns: [
            /^\d{10,11}$/,         // DHL Express (10-11 digits)
            /^[A-Z]{3}\d{7,9}$/i   // DHL eCommerce
        ],
        website: 'https://www.dhl.com'
    },
    sfExpress: {
        name: 'SF Express',
        patterns: [
            /^SF\d{12}$/i,         // SF Express standard (SF + 12 digits)
            /^\d{12}$/             // 12-digit numeric format
        ],
        website: 'https://www.sf-express.com'
    },
    jtExpress: {
        name: 'J&T Express',
        patterns: [
            /^JT\d{13}$/i,         // JT + 13 digits
            /^JD\d{13}$/i          // JD + 13 digits (J&T variant)
        ],
        website: 'https://www.jtexpress.com'
    },
    ztoExpress: {
        name: 'ZTO Express',
        patterns: [
            /^\d{12,13}$/,         // 12-13 digit format
            /^ZTO\d{10,12}$/i      // ZTO prefix + digits
        ],
        website: 'https://www.zto.com'
    },
    ytoExpress: {
        name: 'YTO Express',
        patterns: [
            /^YT\d{13}$/i,         // YT + 13 digits
            /^\d{13}$/             // 13-digit format
        ],
        website: 'https://www.yto.net.cn'
    },
    stoExpress: {
        name: 'STO Express',
        patterns: [
            /^ST\d{13}$/i,         // ST + 13 digits
            /^\d{13}$/             // 13-digit format
        ],
        website: 'https://www.sto.cn'
    },
    ninjaVan: {
        name: 'Ninja Van',
        patterns: [
            /^NVCN\d{10}$/i,       // Singapore format
            /^NVMY\d{10}$/i,       // Malaysia format
            /^NVTH\d{10}$/i,       // Thailand format
            /^NVPH\d{10}$/i,       // Philippines format
            /^NVID\d{10}$/i,       // Indonesia format
            /^NVVN\d{10}$/i        // Vietnam format
        ],
        website: 'https://www.ninjavan.co'
    },
    kerryExpress: {
        name: 'Kerry Express',
        patterns: [
            /^KEX\d{10}$/i,        // KEX + 10 digits
            /^\d{10}$/             // 10-digit format
        ],
        website: 'https://th.kerryexpress.com'
    },
    oldDominion: {
        name: 'Old Dominion Freight',
        patterns: [
            /^OD\d{9}$/i,          // OD + 9 digits
            /^\d{3}-\d{7}$/        // Format: 123-4567890
        ],
        website: 'https://www.odfl.com'
    },
    xpoLogistics: {
        name: 'XPO Logistics',
        patterns: [
            /^XPO\d{10}$/i,        // XPO + 10 digits
            /^\d{3}-\d{8}$/        // Format: 123-12345678
        ],
        website: 'https://www.xpo.com'
    },
    rlCarriers: {
        name: 'R+L Carriers',
        patterns: [
            /^RL\d{9}$/i,          // RL + 9 digits
            /^\d{3}-\d{6}$/        // Format: 123-456789
        ],
        website: 'https://www.rlcarriers.com'
    },
    tnt: {
        name: 'TNT Express',
        patterns: [
            /^[A-Z]{2}\d{9}$/i,    // GD format (FedEx TNT)
            /^\d{9}$/              // 9-digit format
        ],
        website: 'https://www.tnt.com'
    },
    cainiao: {
        name: 'Cainiao',
        patterns: [
            /^LP\d{13}$/i,         // Logistics parcel format
            /^[A-Z]{2}\d{9}CN$/i   // International Cainiao
        ],
        website: 'https://www.cainiao.com'
    },
    yundaExpress: {
        name: 'Yunda Express',
        patterns: [
            /^YD\d{13}$/i,         // YD + 13 digits
            /^\d{13}$/             // 13-digit format
        ],
        website: 'https://www.yundaex.com'
    },
    bestExpress: {
        name: 'Best Express',
        patterns: [
            /^\d{12}$/,            // 12-digit format
            /^BEST\d{10}$/i        // BEST + 10 digits
        ],
        website: 'https://www.best-inc.com'
    }
};

// Detect carrier from tracking number with checksum validation
function detectCarrier(trackingNumber) {
    const cleanedNumber = trackingNumber.trim().replace(/\s+/g, '').toUpperCase();

    // Check each carrier in order (most specific patterns first)
    for (const [key, carrier] of Object.entries(carriers)) {
        for (const pattern of carrier.patterns) {
            if (pattern.test(cleanedNumber)) {
                // Validate checksum if validator exists
                let isValid = true;

                if (key === 'ups') {
                    isValid = checksumValidators.validateUPS(cleanedNumber);
                } else if (key === 'usps') {
                    isValid = checksumValidators.validateUSPS(cleanedNumber);
                } else if (key === 'fedex') {
                    isValid = checksumValidators.validateFedEx(cleanedNumber);
                }

                if (isValid) {
                    return { ...carrier, key };
                } else {
                    return { error: 'invalid', carrier: carrier.name };
                }
            }
        }
    }

    return null;
}

// AI-powered delivery date prediction
function predictDeliveryDate(timeline, carrier, packageInfo) {
    const now = new Date();
    const currentStatus = timeline[timeline.length - 1].status;
    const lastUpdate = timeline[timeline.length - 1].date;

    // Calculate days since last update
    const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

    // Base prediction on current status
    let daysUntilDelivery;
    let confidence;

    switch (currentStatus) {
        case 'Delivered':
            return {
                date: lastUpdate,
                confidence: 100,
                reason: 'Package has been delivered'
            };

        case 'Out for Delivery':
            daysUntilDelivery = 0; // Today
            confidence = 95;
            break;

        case 'In Transit':
            // Analyze journey progress
            const totalEvents = timeline.length;
            const daysInTransit = Math.floor((now - timeline[0].date) / (1000 * 60 * 60 * 24));

            // Estimate based on service type
            if (packageInfo.service === 'Express') {
                daysUntilDelivery = Math.max(1, 3 - daysInTransit);
                confidence = 85;
            } else if (packageInfo.service === 'Priority') {
                daysUntilDelivery = Math.max(1, 5 - daysInTransit);
                confidence = 80;
            } else if (packageInfo.service === 'Standard') {
                daysUntilDelivery = Math.max(2, 7 - daysInTransit);
                confidence = 75;
            } else {
                daysUntilDelivery = Math.max(3, 10 - daysInTransit);
                confidence = 70;
            }
            break;

        case 'Picked Up':
            // Just picked up, estimate based on service type
            if (packageInfo.service === 'Express') {
                daysUntilDelivery = 2;
                confidence = 80;
            } else if (packageInfo.service === 'Priority') {
                daysUntilDelivery = 4;
                confidence = 75;
            } else if (packageInfo.service === 'Standard') {
                daysUntilDelivery = 6;
                confidence = 70;
            } else {
                daysUntilDelivery = 8;
                confidence = 65;
            }
            break;

        case 'Order Processed':
            // Not yet shipped
            if (packageInfo.service === 'Express') {
                daysUntilDelivery = 3;
                confidence = 70;
            } else if (packageInfo.service === 'Priority') {
                daysUntilDelivery = 5;
                confidence = 65;
            } else {
                daysUntilDelivery = 7;
                confidence = 60;
            }
            break;

        default:
            daysUntilDelivery = 5;
            confidence = 60;
    }

    // Adjust for carrier reliability (carrier-specific adjustments)
    const carrierAdjustments = {
        'UPS': { days: -0.5, confidence: 5 },
        'FedEx': { days: -0.5, confidence: 5 },
        'DHL': { days: 0, confidence: 3 },
        'USPS': { days: 1, confidence: -5 }
    };

    if (carrierAdjustments[carrier.name]) {
        daysUntilDelivery += carrierAdjustments[carrier.name].days;
        confidence += carrierAdjustments[carrier.name].confidence;
    }

    // Calculate predicted date
    const predictedDate = new Date(now);
    predictedDate.setDate(predictedDate.getDate() + Math.ceil(daysUntilDelivery));

    // Generate reason
    let reason;
    if (currentStatus === 'Out for Delivery') {
        reason = 'Based on out for delivery status';
    } else if (currentStatus === 'In Transit') {
        reason = `Analyzing ${timeline.length} tracking events and ${carrier.name} delivery patterns`;
    } else {
        reason = `Based on ${packageInfo.service} service and typical ${carrier.name} delivery times`;
    }

    return {
        date: predictedDate,
        confidence: Math.min(95, Math.max(60, confidence)),
        reason,
        daysRemaining: Math.ceil(daysUntilDelivery)
    };
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
        'UPS': ['Louisville, KY, USA', 'Chicago, IL, USA', 'New York, NY, USA'],
        'FedEx': ['Memphis, TN, USA', 'Indianapolis, IN, USA', 'Boston, MA, USA'],
        'USPS': ['Los Angeles, CA, USA', 'Denver, CO, USA', 'Miami, FL, USA'],
        'DHL': ['Cincinnati, OH, USA', 'Atlanta, GA, USA', 'Seattle, WA, USA'],
        'Royal Mail': ['London, UK', 'Birmingham, UK', 'Manchester, UK'],
        'Canada Post': ['Toronto, ON', 'Montreal, QC', 'Vancouver, BC'],
        'Australia Post': ['Sydney, NSW', 'Melbourne, VIC', 'Brisbane, QLD'],
        'China Post': ['Beijing', 'Shanghai', 'Guangzhou'],
        'Japan Post': ['Tokyo', 'Osaka', 'Nagoya'],
        'Deutsche Post': ['Frankfurt', 'Berlin', 'Munich'],
        'La Poste': ['Paris', 'Lyon', 'Marseille'],
        'Correos': ['Madrid', 'Barcelona', 'Valencia'],
        'SF Express': ['Shenzhen, China', 'Beijing, China', 'Shanghai, China'],
        'J&T Express': ['Jakarta, Indonesia', 'Bangkok, Thailand', 'Manila, Philippines'],
        'ZTO Express': ['Shanghai, China', 'Hangzhou, China', 'Guangzhou, China'],
        'YTO Express': ['Shanghai, China', 'Beijing, China', 'Shenzhen, China'],
        'STO Express': ['Hangzhou, China', 'Shanghai, China', 'Guangzhou, China'],
        'Ninja Van': ['Singapore', 'Kuala Lumpur, Malaysia', 'Bangkok, Thailand'],
        'Kerry Express': ['Bangkok, Thailand', 'Chiang Mai, Thailand', 'Phuket, Thailand'],
        'Old Dominion Freight': ['Thomasville, NC, USA', 'Dallas, TX, USA', 'Atlanta, GA, USA'],
        'XPO Logistics': ['Greenwich, CT, USA', 'Chicago, IL, USA', 'Los Angeles, CA, USA'],
        'R+L Carriers': ['Wilmington, OH, USA', 'Chicago, IL, USA', 'Dallas, TX, USA'],
        'TNT Express': ['Amsterdam, Netherlands', 'London, UK', 'Paris, France'],
        'Cainiao': ['Hangzhou, China', 'Shanghai, China', 'Hong Kong'],
        'Yunda Express': ['Shanghai, China', 'Guangzhou, China', 'Beijing, China'],
        'Best Express': ['Hangzhou, China', 'Shanghai, China', 'Guangzhou, China']
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
        dimensions: `${Math.floor(Math.random() * 30 + 10)} × ${Math.floor(Math.random() * 30 + 10)} × ${Math.floor(Math.random() * 30 + 10)} cm`,
        estimatedDelivery: formatDate(new Date(currentDate.getTime() + (Math.random() * 2 + 1) * 24 * 60 * 60 * 1000)),
        service: ['Express', 'Standard', 'Economy', 'Priority'][Math.floor(Math.random() * 4)]
    };

    // Get AI prediction for delivery date
    const aiPrediction = predictDeliveryDate(timeline, carrier, packageInfo);

    return {
        trackingNumber,
        carrier: carrier.name,
        timeline,
        packageInfo,
        currentStatus: timeline[timeline.length - 1].status,
        aiPrediction
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

// Store current tracking data globally
let currentTrackingData = null;
let trackingMap = null;
let savedParcelMetadata = null;

// Function to set saved parcel metadata (called from auth.js)
window.setSavedParcelMetadata = (metadata) => {
    savedParcelMetadata = metadata;
};

// Geocoding service for location coordinates (using Nominatim - free OpenStreetMap service)
async function geocodeLocation(locationString) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}&limit=1`);
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
    } catch (error) {
        console.error('Geocoding error:', error);
    }
    return null;
}

// Initialize or update tracking map
async function updateTrackingMap(timeline) {
    const mapContainer = document.getElementById('trackingMap');

    if (!mapContainer) return;

    // Get coordinates for all locations
    const locations = [];
    for (const event of timeline) {
        const coords = await geocodeLocation(event.location);
        if (coords) {
            locations.push({
                ...event,
                coords
            });
        }
    }

    if (locations.length === 0) {
        mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">Location data unavailable</div>';
        return;
    }

    // Initialize map if not exists
    if (!trackingMap) {
        trackingMap = L.map('trackingMap').setView([locations[0].coords.lat, locations[0].coords.lng], 4);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
        }).addTo(trackingMap);
    }

    // Clear existing markers and lines
    trackingMap.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            trackingMap.removeLayer(layer);
        }
    });

    // Add markers for each location
    locations.forEach((location, index) => {
        const isCurrentLocation = location.isCurrent;

        const icon = L.divIcon({
            html: `<div style="background: ${isCurrentLocation ? '#0066ff' : '#999'}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">${index + 1}</div>`,
            className: 'custom-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const marker = L.marker([location.coords.lat, location.coords.lng], { icon })
            .addTo(trackingMap)
            .bindPopup(`
                <div style="font-size: 12px;">
                    <strong>${location.status}</strong><br>
                    ${location.location}<br>
                    <span style="color: #666;">${formatDate(location.date)}</span>
                </div>
            `);
    });

    // Draw path between locations
    if (locations.length > 1) {
        const pathCoords = locations.map(loc => [loc.coords.lat, loc.coords.lng]);
        L.polyline(pathCoords, {
            color: '#0066ff',
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 10'
        }).addTo(trackingMap);
    }

    // Fit map to show all markers
    const bounds = L.latLngBounds(locations.map(loc => [loc.coords.lat, loc.coords.lng]));
    trackingMap.fitBounds(bounds, { padding: [50, 50] });
}

// Display tracking results
function displayResults(data) {
    // Merge saved metadata if it exists
    if (savedParcelMetadata) {
        data = {
            ...data,
            name: savedParcelMetadata.name || data.name,
            orderNumber: savedParcelMetadata.orderNumber || data.orderNumber,
            invoiceNumber: savedParcelMetadata.invoiceNumber || data.invoiceNumber
        };
        // Clear saved metadata after using it
        savedParcelMetadata = null;
    }

    // Store for saving later
    currentTrackingData = data;

    // Update tracking number and carrier
    document.getElementById('displayTrackingNumber').textContent = data.trackingNumber;
    document.getElementById('displayCarrier').textContent = data.carrier;

    // Add order number and invoice number displays if they exist
    const resultsHeader = document.querySelector('.results-header');

    // Remove any existing order/invoice displays first
    const existingOrderDisplay = document.getElementById('orderNumberDisplay');
    const existingInvoiceDisplay = document.getElementById('invoiceNumberDisplay');
    if (existingOrderDisplay) existingOrderDisplay.remove();
    if (existingInvoiceDisplay) existingInvoiceDisplay.remove();

    // Add order number if it exists
    if (data.orderNumber) {
        const orderDiv = document.createElement('div');
        orderDiv.id = 'orderNumberDisplay';
        orderDiv.className = 'order-display';
        orderDiv.innerHTML = `
            <span class="label">Order Number:</span>
            <span class="order-value">${data.orderNumber}</span>
        `;
        resultsHeader.appendChild(orderDiv);
    }

    // Add invoice number if it exists
    if (data.invoiceNumber) {
        const invoiceDiv = document.createElement('div');
        invoiceDiv.id = 'invoiceNumberDisplay';
        invoiceDiv.className = 'invoice-display';
        invoiceDiv.innerHTML = `
            <span class="label">Invoice Number:</span>
            <span class="invoice-value">${data.invoiceNumber}</span>
        `;
        resultsHeader.appendChild(invoiceDiv);
    }

    // Update status overview
    const statusTitle = document.getElementById('statusTitle');
    const statusDescription = document.getElementById('statusDescription');
    const statusIcon = document.getElementById('statusIcon');

    statusTitle.textContent = data.currentStatus;
    statusDescription.textContent = `Last updated: ${formatDate(data.timeline[data.timeline.length - 1].date)}`;

    // Update status icon and color based on status
    const statusOverview = document.querySelector('.status-overview');
    if (data.currentStatus === 'Delivered') {
        statusOverview.style.background = 'rgba(0, 200, 83, 0.08)';
        statusOverview.style.borderColor = 'rgba(0, 200, 83, 0.2)';
        statusIcon.style.background = '#00c853';
        statusIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    } else if (data.currentStatus === 'Out for Delivery') {
        statusOverview.style.background = 'rgba(255, 149, 0, 0.08)';
        statusOverview.style.borderColor = 'rgba(255, 149, 0, 0.2)';
        statusIcon.style.background = '#ff9500';
        statusIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    } else {
        statusOverview.style.background = 'var(--bg-secondary)';
        statusOverview.style.borderColor = 'var(--border)';
        statusIcon.style.background = '#0066ff';
        statusIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M16 8L20 10.5V17.5L16 20V8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
        `;
    }

    // Update tracking map
    updateTrackingMap(data.timeline);

    // Build timeline
    const timelineContainer = document.getElementById('timelineContainer');
    timelineContainer.innerHTML = '';

    data.timeline.forEach((event) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item' + (event.isCurrent ? ' current' : '');

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

    // Add AI prediction banner if available
    if (data.aiPrediction && data.currentStatus !== 'Delivered') {
        const predictionBanner = document.createElement('div');
        predictionBanner.className = 'ai-prediction-banner';

        let deliveryText;
        if (data.aiPrediction.daysRemaining === 0) {
            deliveryText = 'Today';
        } else if (data.aiPrediction.daysRemaining === 1) {
            deliveryText = 'Tomorrow';
        } else {
            deliveryText = formatDate(data.aiPrediction.date).split(',')[0]; // Just the date part
        }

        predictionBanner.innerHTML = `
            <div class="ai-prediction-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
                <span>AI-Powered Prediction</span>
            </div>
            <div class="ai-prediction-content">
                <div class="prediction-date">${deliveryText}</div>
                <div class="prediction-confidence">${data.aiPrediction.confidence}% confidence</div>
                <div class="prediction-reason">${data.aiPrediction.reason}</div>
            </div>
        `;
        packageInfoContainer.appendChild(predictionBanner);
    }

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

    // Show/hide save button based on auth state
    const saveBtn = document.getElementById('saveParcelBtn');
    if (typeof isUserSignedIn !== 'undefined' && isUserSignedIn()) {
        saveBtn.classList.remove('hidden');
        saveBtn.classList.remove('saved');
        saveBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                <path d="M17 21V13H7V21M7 3V8H15" stroke="currentColor" stroke-width="2"/>
            </svg>
            Save Parcel
        `;
    } else {
        saveBtn.classList.add('hidden');
    }

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
        carrierInfo.innerHTML = '<span style="color: #ff3b30;">Please enter a tracking number</span>';
        return;
    }

    // Detect carrier
    const carrier = detectCarrier(trackingNumber);

    if (!carrier) {
        carrierInfo.innerHTML = `
            <span style="color: #ff9500;">Could not detect carrier from tracking number.</span><br>
            <span style="color: #666666;">Please check the format. Supported: UPS (1Z...), FedEx (12-22 digits), USPS (94/92/93/82...), and international codes (XX123456789YY).</span>
        `;
        return;
    }

    // Check for validation error
    if (carrier.error === 'invalid') {
        carrierInfo.innerHTML = `
            <span style="color: #ff3b30;">Invalid ${carrier.carrier} tracking number.</span><br>
            <span style="color: #666666;">The tracking number format matches ${carrier.carrier}, but the checksum validation failed. Please verify the number is correct.</span>
        `;
        return;
    }

    // Show detected carrier
    carrierInfo.innerHTML = `
        <span style="color: #00c853;">Detected carrier: <strong>${carrier.name}</strong></span><br>
        <span style="color: #666666;">Retrieving tracking information...</span>
    `;

    // Simulate API delay
    setTimeout(() => {
        const trackingData = generateTrackingData(trackingNumber, carrier);
        displayResults(trackingData);
        carrierInfo.innerHTML = '';
    }, 800);
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
    const saveParcelBtn = document.getElementById('saveParcelBtn');

    trackButton.addEventListener('click', handleTracking);

    trackingInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleTracking();
        }
    });

    newTrackingButton.addEventListener('click', handleNewTracking);

    // Save parcel button - show name modal
    saveParcelBtn.addEventListener('click', () => {
        if (!currentTrackingData) return;

        if (typeof saveParcelToDatabase === 'undefined') {
            alert('Authentication not initialized. Please refresh the page.');
            return;
        }

        // Show name modal
        document.getElementById('nameParcelModal').classList.remove('hidden');
        document.getElementById('parcelNameInput').value = '';
        document.getElementById('orderNumberInput').value = '';
        document.getElementById('invoiceNumberInput').value = '';
        document.getElementById('parcelNameInput').focus();
    });

    // Name modal handlers
    const nameModal = document.getElementById('nameParcelModal');
    const parcelNameInput = document.getElementById('parcelNameInput');
    const orderNumberInput = document.getElementById('orderNumberInput');
    const invoiceNumberInput = document.getElementById('invoiceNumberInput');
    const closeNameModal = document.getElementById('closeNameModal');
    const cancelSaveBtn = document.getElementById('cancelSaveBtn');
    const confirmSaveBtn = document.getElementById('confirmSaveBtn');

    // Close modal
    const hideNameModal = () => {
        nameModal.classList.add('hidden');
        parcelNameInput.value = '';
        orderNumberInput.value = '';
        invoiceNumberInput.value = '';
    };

    closeNameModal.addEventListener('click', hideNameModal);
    cancelSaveBtn.addEventListener('click', hideNameModal);

    // Click outside to close
    nameModal.addEventListener('click', (e) => {
        if (e.target === nameModal) {
            hideNameModal();
        }
    });

    // Confirm save
    confirmSaveBtn.addEventListener('click', async () => {
        if (!currentTrackingData) return;

        const parcelName = parcelNameInput.value.trim();
        const orderNumber = orderNumberInput.value.trim();
        const invoiceNumber = invoiceNumberInput.value.trim();

        // Add name, order number, and invoice number to tracking data
        const dataToSave = {
            ...currentTrackingData,
            name: parcelName || null,
            orderNumber: orderNumber || null,
            invoiceNumber: invoiceNumber || null
        };

        const success = await saveParcelToDatabase(dataToSave);

        if (success) {
            hideNameModal();

            const saveBtn = document.getElementById('saveParcelBtn');
            saveBtn.classList.add('saved');
            saveBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Saved!
            `;

            setTimeout(() => {
                saveBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3.89543 3 5 3 H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M17 21V13H7V21M7 3V8H15" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Save Parcel
                `;
                saveBtn.classList.remove('saved');
            }, 2000);
        }
    });

    // Enter key to save
    parcelNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmSaveBtn.click();
        }
    });

    // Auto-detect carrier as user types
    trackingInput.addEventListener('input', (e) => {
        const trackingNumber = e.target.value.trim();
        const carrierInfo = document.getElementById('carrierInfo');

        if (trackingNumber.length > 5) {
            const carrier = detectCarrier(trackingNumber);
            if (carrier) {
                carrierInfo.innerHTML = `<span style="color: #00c853;">Detected: <strong>${carrier.name}</strong></span>`;
            } else {
                carrierInfo.innerHTML = '';
            }
        } else {
            carrierInfo.innerHTML = '';
        }
    });
});

// Example tracking numbers for testing (displayed in console)
console.log('%cExample tracking numbers for testing:', 'font-weight: bold; font-size: 14px;');
console.log('UPS: 1Z999AA10123456784');
console.log('FedEx: 123456789012 or 961234567890123456789012');
console.log('USPS: 9400111899562843678599');
console.log('DHL: 1234567890');
console.log('Royal Mail: AB123456789GB');
console.log('Canada Post: 1234567890123456');
console.log('Australia Post: AB123456789AU');
console.log('China Post: AB123456789CN');
