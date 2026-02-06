// ? IMPORTING OBSERVER
import { observer } from '../base/observer.js';

// ? GETTING DOC ELEMENTS
const returnRate = document.getElementById('returnRate');
const forwardShipping = document.getElementById('forwardShipping');
const backwardShipping = document.getElementById('backwardShipping');
const packagingCost = document.getElementById('packagingCost');
const rtoRate = document.getElementById('rtoRate');
const rtoCharge = document.getElementById('rtoCharge');
const calculateBtn = document.querySelector('#calcbtn');
const resetBtn = document.querySelector('#resbtn');
const crLossOutput = document.getElementById('crLoss');
const rtoLossOutput = document.getElementById('rtoLoss');
const totalLossOutput = document.getElementById('totalLoss');


// * FUNCTION TO CALCULATE CR LOSSES
function calculateCRLoss({
    returnRate,          // % (eg. 5)
    forwardShipping,     // ₹
    reverseShipping,     // ₹
    packagingCost        // ₹
}) {
    const rate = returnRate / 100;
    const returnCost = forwardShipping + reverseShipping + packagingCost;
    return rate * returnCost; // loss per order
}

// * FUNCTION TO CALCULATE RTO LOSSES
function calculateRTOLoss({
    rtoRate,             // % (eg. 10)
    rtoCharge,           // ₹
}) {
    const rate = rtoRate / 100;
    return rate * rtoCharge; // loss per order
}

// & LOSS CALCULATION FUNCTIONALITY
calculateBtn.addEventListener('click', () => {
    // GET ALL INPUT VALUES
    const returnRateValue = Number(returnRate.value) || 0;
    const forwardShippingValue = Number(forwardShipping.value) || 0;
    const backwardShippingValue = Number(backwardShipping.value) || 0;
    const packagingCostValue = Number(packagingCost.value) || 0;
    const rtoRateValue = Number(rtoRate.value) || 0;
    const rtoChargeValue = Number(rtoCharge.value) || 0;

    // CALCULATE CR LOSS
    const crLoss = calculateCRLoss({
        returnRate: returnRateValue,
        forwardShipping: forwardShippingValue,
        reverseShipping: backwardShippingValue,
        packagingCost: packagingCostValue
    });

    // CALCULATE RTO LOSS
    const rtoLoss = calculateRTOLoss({
        rtoRate: rtoRateValue,
        rtoCharge: rtoChargeValue
    });

    // CALCULATE TOTAL LOSS
    const totalLoss = crLoss + rtoLoss;

    // FORMAT CURRENCY AND SHOW OUTPUT
    const formatCurrency = (value) => `\u20B9 ${value.toFixed(2)}`;
    crLossOutput.textContent = formatCurrency(crLoss);
    rtoLossOutput.textContent = formatCurrency(rtoLoss);
    totalLossOutput.textContent = formatCurrency(totalLoss);
})

// & RESET FUNCTIONALITY
resetBtn.addEventListener('click', () => {
    // RESET ALL INPUTS
    returnRate.value = '';
    forwardShipping.value = '';
    backwardShipping.value = '';
    packagingCost.value = '';
    rtoRate.value = '';
    rtoCharge.value = '';

    // RESET ALL OUTPUTS
    crLossOutput.textContent = '\u20B9 0.00';
    rtoLossOcrLossOutput.textContent = '\u20B9 0.00';
    totalLossOcrLossOutput.textContent = '\u20B9 0.00';
})

// ? GETTING SECTION ELEMENTS
const calculatorSection = document.querySelector('.calculator');

// & PREPARING OBSERVABLES ARRAY
const observables = [calculatorSection];

// & OBSERVING ELEMENTS
observables.forEach((observable) => {
    observer.observe(observable)
})