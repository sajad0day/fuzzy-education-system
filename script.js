// دالة العضوية المثلثية
function triangularMF(x, a, b, c) {
    return Math.max(Math.min((x - a) / (b - a), (c - x) / (c - b)), 0);
}

// دالة العضوية الغاوسية
function gaussianMF(x, c, σ) {
    return Math.exp(-0.5 * Math.pow((x - c) / σ, 2));
}

// نظام الاستنتاج الضبابي
function fuzzyInference(temperature, humidity, membershipType) {
    let comfort = 0;

    // اختيار نوع دالة العضوية بناءً على اختيار المستخدم
    let membershipFunction = (membershipType === 'gaussian') ? gaussianMF : triangularMF;

    // حساب العضوية بناءً على النوع المحدد
    let tempLow = membershipFunction(temperature, 0, 0, 25);
    let tempMedium = membershipFunction(temperature, 20, 25, 30);
    let tempHigh = membershipFunction(temperature, 25, 30, 35);

    let humidityLow = membershipFunction(humidity, 0, 0, 50);
    let humidityHigh = membershipFunction(humidity, 50, 100, 100);

    // قواعد الضبابية
    if (tempLow > 0 && humidityHigh > 0) {
        comfort = Math.min(tempLow, humidityHigh) * 0.2;
    }
    if (tempMedium > 0 && humidityLow > 0) {
        comfort = Math.min(tempMedium, humidityLow) * 0.7;
    }

    return comfort;
}

// المتغير لحفظ المخطط الحالي
let chart;

// تشغيل النظام الضبابي
function runFuzzySystem() {
    const temperature = document.getElementById("temperature").value;
    const humidity = document.getElementById("humidity").value;
    const membershipType = document.getElementById("membershipType").value;
    
    const comfortLevel = fuzzyInference(temperature, humidity, membershipType);
    
    document.getElementById("result").textContent = `النتيجة: مستوى الراحة = ${comfortLevel.toFixed(2)}`;

    // تحديث الرسم البياني
    updateChart(temperature, humidity, membershipType);
}

// تحديث الرسم البياني
function updateChart(temperature, humidity, membershipType) {
    const ctx = document.getElementById('membershipChart').getContext('2d');

    // تدمير المخطط الحالي إذا كان موجودًا
    if (chart) {
        chart.destroy();
    }

    // اختيار نوع دالة العضوية بناءً على الاختيار
    const membershipFunction = (membershipType === 'gaussian') ? gaussianMF : triangularMF;

    // إنشاء المخطط الجديد
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [0, 10, 20, 30, 40],
            datasets: [{
                label: 'درجة الحرارة',
                data: [0, membershipFunction(temperature, 0, 0, 25), membershipFunction(temperature, 20, 25, 30), membershipFunction(temperature, 25, 30, 35), 0],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }, {
                label: 'الرطوبة',
                data: [0, membershipFunction(humidity, 0, 0, 50), 0, 0, membershipFunction(humidity, 50, 100, 100)],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        }
    });
}
