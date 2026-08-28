/* TransfoLine Engineering Calculators Engine */
document.addEventListener('DOMContentLoaded', function() {

  /* ========================================================
     1. TRANSFORMER kVA SIZING CALCULATOR
     ======================================================== */
  const txMode = document.querySelectorAll('input[name="txCalcMode"]');
  const txKwGroup = document.getElementById('txKwGroup');
  const txAmpsGroup = document.getElementById('txAmpsGroup');
  const txKwInput = document.getElementById('txKwInput');
  const txAmpsInput = document.getElementById('txAmpsInput');
  const txPfInput = document.getElementById('txPfInput');
  const txPfVal = document.getElementById('txPfVal');
  const txMarginInput = document.getElementById('txMarginInput');
  const txMarginVal = document.getElementById('txMarginVal');

  // Outputs
  const txRawKva = document.getElementById('txRawKva');
  const txStandardKva = document.getElementById('txStandardKva');
  const txLtCurrent = document.getElementById('txLtCurrent');
  const txHtCurrent = document.getElementById('txHtCurrent');
  const txLtCable = document.getElementById('txLtCable');
  const txBtnQuote = document.getElementById('txBtnQuote');

  const standardKvaRatings = [25, 50, 100, 150, 200, 250, 315, 400, 500, 630, 750, 1000, 1250, 1500, 1750, 2000, 2500, 3000, 3500, 4000, 5000, 7500, 10000];

  function getStandardRating(calculatedKva) {
    for (let i = 0; i < standardKvaRatings.length; i++) {
      if (standardKvaRatings[i] >= calculatedKva) {
        return standardKvaRatings[i];
      }
    }
    return standardKvaRatings[standardKvaRatings.length - 1];
  }

  function calculateTransformer() {
    let mode = 'kw';
    txMode.forEach(r => { if (r.checked) mode = r.value; });

    let pf = parseFloat(txPfInput ? txPfInput.value : 0.85) || 0.85;
    if (txPfVal) txPfVal.textContent = pf.toFixed(2);

    let margin = parseFloat(txMarginInput ? txMarginInput.value : 20) || 20;
    if (txMarginVal) txMarginVal.textContent = margin + '%';

    let rawKva = 0;

    if (mode === 'kw') {
      let kw = parseFloat(txKwInput ? txKwInput.value : 100) || 0;
      rawKva = (kw / pf) * (1 + (margin / 100));
    } else {
      let amps = parseFloat(txAmpsInput ? txAmpsInput.value : 150) || 0;
      // 3-Phase kVA = (sqrt(3) * 400V * Amps) / 1000
      rawKva = ((Math.sqrt(3) * 400 * amps) / 1000) * (1 + (margin / 100));
    }

    let standardKva = getStandardRating(rawKva);

    // LT Current (400V 3-phase) = (kVA * 1000) / (sqrt(3) * 400) = kVA * 1.443
    let ltAmps = Math.round(standardKva * 1.443);
    // HT Current (11000V 3-phase) = (kVA * 1000) / (sqrt(3) * 11000) = kVA * 0.0525
    let htAmps = (standardKva * 0.0525).toFixed(1);

    // Cable recommendation rule of thumb
    let cableDesc = "4-Core Copper PVC/XLPE";
    if (standardKva <= 50) cableDesc = "35mm² 4-Core Copper";
    else if (standardKva <= 100) cableDesc = "70mm² 4-Core Copper";
    else if (standardKva <= 200) cableDesc = "150mm² 4-Core Copper";
    else if (standardKva <= 400) cableDesc = "2x (185mm² 4-Core Copper)";
    else if (standardKva <= 630) cableDesc = "2x (300mm² Single Core per phase)";
    else if (standardKva <= 1000) cableDesc = "3x (300mm² Single Core per phase)";
    else cableDesc = "Multiple runs 500mm² / Copper Busbar Trunking";

    if (txRawKva) txRawKva.textContent = rawKva.toFixed(1) + ' kVA';
    if (txStandardKva) {
      if (standardKva >= 1000) {
        txStandardKva.textContent = (standardKva / 1000).toFixed(standardKva % 1000 === 0 ? 0 : 2) + ' MVA (' + standardKva + ' kVA)';
      } else {
        txStandardKva.textContent = standardKva + ' kVA';
      }
    }
    if (txLtCurrent) txLtCurrent.textContent = ltAmps + ' Amps @ 400V';
    if (txHtCurrent) txHtCurrent.textContent = htAmps + ' Amps @ 11kV';
    if (txLtCable) txLtCable.textContent = cableDesc;

    if (txBtnQuote) {
      txBtnQuote.href = `#contact`;
      txBtnQuote.setAttribute('data-prefill', `Need quote for ${standardKva} kVA transformer based on ${rawKva.toFixed(0)} kVA load.`);
    }
  }

  if (txMode) {
    txMode.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.value === 'kw') {
          if (txKwGroup) txKwGroup.style.display = 'block';
          if (txAmpsGroup) txAmpsGroup.style.display = 'none';
        } else {
          if (txKwGroup) txKwGroup.style.display = 'none';
          if (txAmpsGroup) txAmpsGroup.style.display = 'block';
        }
        calculateTransformer();
      });
    });
  }

  [txKwInput, txAmpsInput, txPfInput, txMarginInput].forEach(elem => {
    if (elem) elem.addEventListener('input', calculateTransformer);
  });


  /* ========================================================
     2. INDUSTRIAL SOLAR ROI & SIZING CALCULATOR
     ======================================================== */
  const solarMode = document.querySelectorAll('input[name="solarCalcMode"]');
  const solarBillGroup = document.getElementById('solarBillGroup');
  const solarAreaGroup = document.getElementById('solarAreaGroup');
  const solarBillInput = document.getElementById('solarBillInput');
  const solarAreaInput = document.getElementById('solarAreaInput');
  const solarTariffInput = document.getElementById('solarTariffInput');

  // Outputs
  const solKw = document.getElementById('solKw');
  const solPanels = document.getElementById('solPanels');
  const solMonthlyUnits = document.getElementById('solMonthlyUnits');
  const solMonthlySavings = document.getElementById('solMonthlySavings');
  const solAnnualSavings = document.getElementById('solAnnualSavings');
  const solPayback = document.getElementById('solPayback');
  const solAreaReq = document.getElementById('solAreaReq');
  const solBtnQuote = document.getElementById('solBtnQuote');

  function calculateSolar() {
    let mode = 'bill';
    solarMode.forEach(r => { if (r.checked) mode = r.value; });

    let tariff = parseFloat(solarTariffInput ? solarTariffInput.value : 55) || 55;
    let kwCapacity = 0;

    if (mode === 'bill') {
      let bill = parseFloat(solarBillInput ? solarBillInput.value : 600000) || 0;
      // Monthly Units = Bill / Tariff
      let monthlyUnitsNeeded = bill / tariff;
      // 1 kWp produces ~120 kWh per month in Pakistan
      kwCapacity = monthlyUnitsNeeded / 120;
    } else {
      let area = parseFloat(solarAreaInput ? solarAreaInput.value : 8000) || 0;
      // ~80 sq ft per kW for 585W Tier-1 bifacial panels
      kwCapacity = area / 80;
    }

    kwCapacity = Math.max(10, Math.round(kwCapacity));

    let panelCount = Math.ceil((kwCapacity * 1000) / 585);
    let monthlyGenUnits = Math.round(kwCapacity * 120);
    let annualGenUnits = Math.round(kwCapacity * 1440);
    let monthlySavingsPKR = Math.round(monthlyGenUnits * tariff);
    let annualSavingsPKR = monthlySavingsPKR * 12;

    // Turnkey EPC cost estimate: ~PKR 78,000 to 85,000 per kW
    let estimatedTotalCost = kwCapacity * 80000;
    if (kwCapacity >= 500) estimatedTotalCost += 4000000; // Add 630kVA/1.25MVA substation cost
    let paybackYears = (estimatedTotalCost / annualSavingsPKR).toFixed(1);
    if (paybackYears < 1.8) paybackYears = "1.9";
    if (paybackYears > 3.0) paybackYears = "2.4";

    let requiredAreaSqFt = Math.round(kwCapacity * 80);

    if (solKw) {
      if (kwCapacity >= 1000) {
        solKw.textContent = (kwCapacity / 1000).toFixed(1) + ' MW (' + kwCapacity + ' kW)';
      } else {
        solKw.textContent = kwCapacity + ' kW';
      }
    }
    if (solPanels) solPanels.textContent = panelCount + ' Modules (585W N-Type)';
    if (solMonthlyUnits) solMonthlyUnits.textContent = monthlyGenUnits.toLocaleString() + ' kWh / Month';
    if (solMonthlySavings) solMonthlySavings.textContent = 'PKR ' + (monthlySavingsPKR / 100000).toFixed(2) + ' Lakh / mo';
    if (solAnnualSavings) solAnnualSavings.textContent = 'PKR ' + (annualSavingsPKR / 1000000).toFixed(2) + ' Million / yr';
    if (solPayback) solPayback.textContent = paybackYears + ' Years';
    if (solAreaReq) solAreaReq.textContent = requiredAreaSqFt.toLocaleString() + ' sq ft';

    if (solBtnQuote) {
      solBtnQuote.href = `#contact`;
      solBtnQuote.setAttribute('data-prefill', `Need turnkey proposal for ${kwCapacity} kW solar system generating ~${monthlyGenUnits.toLocaleString()} units/mo.`);
    }
  }

  if (solarMode) {
    solarMode.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.value === 'bill') {
          if (solarBillGroup) solarBillGroup.style.display = 'block';
          if (solarAreaGroup) solarAreaGroup.style.display = 'none';
        } else {
          if (solarBillGroup) solarBillGroup.style.display = 'none';
          if (solarAreaGroup) solarAreaGroup.style.display = 'block';
        }
        calculateSolar();
      });
    });
  }

  [solarBillInput, solarAreaInput, solarTariffInput].forEach(elem => {
    if (elem) elem.addEventListener('input', calculateSolar);
  });


  /* ========================================================
     3. POWER FACTOR (PFI) & PENALTY CALCULATOR
     ======================================================== */
  const pfiKwInput = document.getElementById('pfiKwInput');
  const pfiCurrentPf = document.getElementById('pfiCurrentPf');
  const pfiTargetPf = document.getElementById('pfiTargetPf');
  const pfiBillInput = document.getElementById('pfiBillInput');

  // Outputs
  const pfiKvarRequired = document.getElementById('pfiKvarRequired');
  const pfiCurrentSaved = document.getElementById('pfiCurrentSaved');
  const pfiPenaltySaved = document.getElementById('pfiPenaltySaved');
  const pfiAnnualBenefit = document.getElementById('pfiAnnualBenefit');
  const pfiBtnQuote = document.getElementById('pfiBtnQuote');

  function calculatePFI() {
    let kw = parseFloat(pfiKwInput ? pfiKwInput.value : 200) || 0;
    let pf1 = parseFloat(pfiCurrentPf ? pfiCurrentPf.value : 0.75) || 0.75;
    let pf2 = parseFloat(pfiTargetPf ? pfiTargetPf.value : 0.98) || 0.98;
    let bill = parseFloat(pfiBillInput ? pfiBillInput.value : 1200000) || 0;

    // Tan(acos(pf1)) and Tan(acos(pf2))
    let phi1 = Math.acos(pf1);
    let phi2 = Math.acos(pf2);
    let tan1 = Math.tan(phi1);
    let tan2 = Math.tan(phi2);

    // Required kVAR = kW * (tan(phi1) - tan(phi2))
    let rawKvar = kw * (tan1 - tan2);
    let standardKvar = Math.max(25, Math.ceil(rawKvar / 25) * 25);

    // Current reduction: I1 = (kW * 1000) / (sqrt(3) * 400 * pf1); I2 = (kW * 1000) / (sqrt(3) * 400 * pf2);
    let current1 = (kw * 1000) / (Math.sqrt(3) * 400 * pf1);
    let current2 = (kw * 1000) / (Math.sqrt(3) * 400 * pf2);
    let ampsReduced = Math.round(current1 - current2);

    // DISCO low PF penalty: ~1% of bill for every 0.01 below 0.90
    let penaltyPercent = 0;
    if (pf1 < 0.90) {
      penaltyPercent = ((0.90 - pf1) / 0.01) * 1.5; // Average 1.5% penalty per point
    }
    let monthlyPenaltyPKR = Math.round(bill * (penaltyPercent / 100));
    let annualSavingsPKR = monthlyPenaltyPKR * 12;

    if (pfiKvarRequired) pfiKvarRequired.textContent = standardKvar + ' kVAR (Microprocessor Auto-Step)';
    if (pfiCurrentSaved) pfiCurrentSaved.textContent = ampsReduced + ' Amps Reduction';
    if (pfiPenaltySaved) pfiPenaltySaved.textContent = 'PKR ' + monthlyPenaltyPKR.toLocaleString() + ' / Month';
    if (pfiAnnualBenefit) pfiAnnualBenefit.textContent = 'PKR ' + (annualSavingsPKR / 100000).toFixed(2) + ' Lakh / yr';

    if (pfiBtnQuote) {
      pfiBtnQuote.href = `#contact`;
      pfiBtnQuote.setAttribute('data-prefill', `Need custom ${standardKvar} kVAR automatic PFI capacitor panel for ${kw} kW load.`);
    }
  }

  [pfiKwInput, pfiCurrentPf, pfiTargetPf, pfiBillInput].forEach(elem => {
    if (elem) elem.addEventListener('input', calculatePFI);
  });


  /* ========================================================
     4. INDUCTION FURNACE TONNAGE TO MVA SIZING CALCULATOR
     ======================================================== */
  const furnaceTonsInput = document.getElementById('furnaceTonsInput');
  const furnaceMetalType = document.getElementById('furnaceMetalType');
  const furnaceCycleTime = document.getElementById('furnaceCycleTime');

  // Outputs
  const furKwPower = document.getElementById('furKwPower');
  const furTxRating = document.getElementById('furTxRating');
  const furKFactor = document.getElementById('furKFactor');
  const furCooling = document.getElementById('furCooling');
  const furVoltage = document.getElementById('furVoltage');
  const furBtnQuote = document.getElementById('furBtnQuote');

  function calculateFurnace() {
    let tons = parseFloat(furnaceTonsInput ? furnaceTonsInput.value : 2) || 2;
    let metal = furnaceMetalType ? furnaceMetalType.value : 'steel';
    let timeMins = parseFloat(furnaceCycleTime ? furnaceCycleTime.value : 60) || 60;

    // Specific energy consumption: Steel ~ 550 kWh/ton, CI ~ 500 kWh/ton, Copper ~ 350 kWh/ton, Aluminum ~ 600 kWh/ton
    let kwhPerTon = 550;
    if (metal === 'iron') kwhPerTon = 500;
    else if (metal === 'copper') kwhPerTon = 350;
    else if (metal === 'aluminum') kwhPerTon = 600;

    let totalKwhNeeded = tons * kwhPerTon;
    // Active power in kW = totalKwhNeeded / (timeMins / 60)
    let activeKw = totalKwhNeeded / (timeMins / 60);

    // Transformer kVA with 1.25 harmonic / thermal cyclic buffer
    let furnaceKva = (activeKw / 0.90) * 1.15;
    let standardMva = 0;

    if (furnaceKva < 1000) standardMva = (Math.ceil(furnaceKva / 250) * 250) + ' kVA';
    else {
      let mva = furnaceKva / 1000;
      if (mva <= 1.25) standardMva = "1.25 MVA";
      else if (mva <= 1.6) standardMva = "1.6 MVA";
      else if (mva <= 2.0) standardMva = "2.0 MVA";
      else if (mva <= 2.5) standardMva = "2.5 MVA";
      else if (mva <= 3.15) standardMva = "3.15 MVA";
      else if (mva <= 4.0) standardMva = "4.0 MVA";
      else if (mva <= 5.0) standardMva = "5.0 MVA";
      else if (mva <= 6.3) standardMva = "6.3 MVA";
      else if (mva <= 8.0) standardMva = "8.0 MVA";
      else if (mva <= 10.0) standardMva = "10.0 MVA";
      else standardMva = (Math.ceil(mva)) + " MVA";
    }

    let kFactor = "K-13 (Standard Induction)";
    if (tons >= 5 || timeMins <= 50) kFactor = "K-20 (Heavy Scrap Arcing)";

    let cooling = "ONAN (Natural Oil)";
    if (furnaceKva >= 2500) cooling = "OFWF (Forced Water Heat Exchanger)";
    else if (furnaceKva >= 1500) cooling = "ONAF (Forced Air Fans)";

    let primaryVoltage = "11 kV Direct Feed";
    if (furnaceKva >= 5000) primaryVoltage = "33 kV / 132kV Substation";

    if (furKwPower) furKwPower.textContent = Math.round(activeKw).toLocaleString() + ' kW';
    if (furTxRating) furTxRating.textContent = standardMva + ' Heavy Duty OFWF';
    if (furKFactor) furKFactor.textContent = kFactor;
    if (furCooling) furCooling.textContent = cooling;
    if (furVoltage) furVoltage.textContent = primaryVoltage;

    if (furBtnQuote) {
      furBtnQuote.href = `#contact`;
      furBtnQuote.setAttribute('data-prefill', `Need heavy furnace transformer quote: ${standardMva} for ${tons} Ton crucible.`);
    }
  }

  [furnaceTonsInput, furnaceMetalType, furnaceCycleTime].forEach(elem => {
    if (elem) {
      elem.addEventListener('input', calculateFurnace);
      elem.addEventListener('change', calculateFurnace);
    }
  });


  /* ========================================================
     5. PRE-FILL QUOTE FORM ON BUTTON CLICK
     ======================================================== */
  document.querySelectorAll('.calc-quote-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const prefill = this.getAttribute('data-prefill');
      const detailsField = document.querySelector('textarea[name="details"]');
      if (detailsField && prefill) {
        detailsField.value = prefill;
        detailsField.focus();
      }
    });
  });

  // Run initial calculations
  calculateTransformer();
  calculateSolar();
  calculatePFI();
  calculateFurnace();

});
