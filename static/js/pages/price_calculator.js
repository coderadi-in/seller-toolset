// ? GETTING DOC ELEMENTS
const productCost = document.getElementById('productCost');
const shippingCost = document.getElementById('shippingCost');
const packagingCost = document.getElementById('packagingCost');
const crLoss = document.getElementById('crLoss');
const rtoRate = document.getElementById('rtoRate');
const commissionFee = document.getElementById('commissionFee');
const adsCost = document.getElementById('adsCost');
const profitMarginInput = document.getElementById('desiredMargin');
const discount = document.getElementById('discount');
const taxRate = document.getElementById('taxRate');

const calculateBtn = document.getElementById('calcbtn');
const resetBtn = document.getElementById('resbtn');

const totalCostOutput = document.getElementById('totalCost');
const sellingPriceOutput = document.getElementById('sellingPrice');
const expectedProfitOutput = document.getElementById('expectedProfit');
const profitMarginOutput = document.getElementById('profitMargin');



// * FUNCTION TO GET SUMMARY INSIGHTS
function getPricingInsights({
    productCost,          // ₹
    shippingCost,         // ₹
    packagingCost,        // ₹
    crLossPerOrder,       // ₹

    rtoRatePercent,       // %
    commissionPercent,    // %
    adsCostPerOrder,      // ₹

    desiredProfitMargin,  // %
    discountPercent,      // %
    gstPercent            // %
}) {
    // CONVERT RATE TO VALUE
    const rtoRate = rtoRatePercent / 100;
    const commissionRate = commissionPercent / 100;
    const profitRate = desiredProfitMargin / 100;
    const discountRate = discountPercent / 100;
    const gstRate = gstPercent / 100;

    // 1. ESTIMATE RTO LOSS
    // Assumption: RTO loss mainly adds shipping + packaging again
    const rtoLossPerOrder = rtoRate * (shippingCost + packagingCost);

    // 2. BASE COST (DIRECT EXPENSE)
    const baseCost =
        productCost +
        shippingCost +
        packagingCost +
        crLossPerOrder +
        rtoLossPerOrder +
        adsCostPerOrder;

    const denominator =
        1 - discountRate - commissionRate - gstRate - profitRate;

    if (denominator <= 0) {
        throw new Error(
            "Invalid inputs: Margin + Discount + Fees + GST exceed 100%"
        );
    }

    // 4. SUGGESTED SELLING PRICE
    const sellingPrice = baseCost / denominator;

    // 5. COMPUTE FINAL VALUES
    const discountAmount = sellingPrice * discountRate;
    const netRevenue = sellingPrice - discountAmount;

    const commissionCost = sellingPrice * commissionRate;
    const gstCost = sellingPrice * gstRate;

    const totalCostPerOrder = baseCost + commissionCost + gstCost;

    const expectedProfit = netRevenue - totalCostPerOrder;

    const actualProfitMargin =
        (expectedProfit / netRevenue) * 100;

    return {
        totalCostPerOrder: totalCostPerOrder.toFixed(2),
        suggestedSellingPrice: sellingPrice.toFixed(2),
        expectedProfit: expectedProfit.toFixed(2),
        profitMarginPercent: actualProfitMargin.toFixed(2),

        breakdown: {
            baseCost: baseCost.toFixed(2),
            rtoLossPerOrder: rtoLossPerOrder.toFixed(2),
            commissionCost: commissionCost.toFixed(2),
            gstCost: gstCost.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            netRevenue: netRevenue.toFixed(2)
        }
    };
}

// & PRICE CALCULATION FUNCTIONALITY
calculateBtn.addEventListener('click', () => {
    const productCostValue = Number(productCost.value) || 0;
    const shippingCostValue = Number(shippingCost.value) || 0;
    const packagingCostValue = Number(packagingCost.value) || 0;
    const crLossValue = Number(crLoss.value) || 0;
    const rtoRateValue = Number(rtoRate.value) || 0;
    const commissionFeeValue = Number(commissionFee.value) || 0;
    const adsCostValue = Number(adsCost.value) || 0;
    const desiredMarginValue = Number(profitMarginInput.value) || 0;
    const discountValue = Number(discount.value) || 0;
    const taxRateValue = Number(taxRate.value) || 0;

    try {
        const results = getPricingInsights({
            productCost: productCostValue,
            shippingCost: shippingCostValue,
            packagingCost: packagingCostValue,
            crLossPerOrder: crLossValue,
            rtoRatePercent: rtoRateValue,
            commissionPercent: commissionFeeValue,
            adsCostPerOrder: adsCostValue,
            desiredProfitMargin: desiredMarginValue,
            discountPercent: discountValue,
            gstPercent: taxRateValue
        });

        totalCostOutput.textContent = `\u20B9 ${results.totalCostPerOrder}`;
        sellingPriceOutput.textContent = `\u20B9 ${results.suggestedSellingPrice}`;
        expectedProfitOutput.textContent = `\u20B9 ${results.expectedProfit}`;
        profitMarginOutput.textContent = `${results.profitMarginPercent} %`;

    } catch (error) {
        console.error(error);
        totalCostOutput.textContent = '\u20B9 0.00';
        sellingPriceOutput.textContent = '\u20B9 0.00';
        expectedProfitOutput.textContent = '\u20B9 0.00';
        profitMarginOutput.textContent = '0.00 %';
    }
})

// & RESET FUNCTIONALITY
resetBtn.addEventListener('click', () => {
    productCost.value = '';
    shippingCost.value = '';
    packagingCost.value = '';
    crLoss.value = '';
    rtoRate.value = '';
    commissionFee.value = '';
    adsCost.value = '';
    profitMarginInput.value = '';
    discount.value = '';
    taxRate.value = '18';

    totalCostOutput.textContent = '\u20B9 0.00';
    sellingPriceOutput.textContent = '\u20B9 0.00';
    expectedProfitOutput.textContent = '\u20B9 0.00';
    profitMarginOutput.textContent = '0.00 %';
})
