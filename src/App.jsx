import { useState } from 'react'
import './index.css'


function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTextChange = (e) => {
    setField(e.target.name, e.target.value);
  };

  const toggleMultiSelect = (name, value) => {
    const current = formData[name] || [];
    const newValues = current.includes(value) 
      ? current.filter(v => v !== value)
      : [...current, value];
    setField(name, newValues);
  };

  const [submitted, setSubmitted] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  // UPI Payment — open UPI app directly
  const UPI_ID = '7348884111@ibl';
  const UPI_NAME = 'Command Finance';
  const UPI_AMOUNT = '100';

  const handleUPIPayment = () => {
    const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${UPI_AMOUNT}&cu=INR&tn=${encodeURIComponent('Early Supporter - 50% off Tax Filing')}`;
    // Use location.href so it opens GPay / PhonePe / Paytm directly without WhatsApp
    window.location.href = upiUrl;
  };

  // Common options
  const yesNo = ['Yes', 'No'];
  const commonBanks = ['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Ofc Provided', 'Other'];
  const paymentModes = ['UPI', 'Credit Card', 'Debit Card', 'Netbanking', 'Cash'];
  const platforms = ['Zerodha', 'Groww', 'Upstox', 'Paytm Money', 'Smallcase', 'Bank App', 'Kuvera', 'Other'];
  const researchSources = ['Friends/Family', 'YouTube', 'News', 'Advisors', 'Twitter', 'Self Research', 'Instagram'];
  const satisfaction = ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'];
  const insuranceTypes = ['Life/Term', 'Health', 'Vehicle', 'Home', 'None'];

  // Define survey logic
  const sections = [
    // ─── SECTION 1: About You ───
    {
      id: 'personal',
      title: 'About You',
      questions: [
        { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your name' },
        { id: 'age', label: 'Age Group', type: 'bubble', options: ['18-24', '25-34', '35-44', '45-54', '55+'] },
        { id: 'place', label: 'City', type: 'bubble-input', options: ['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai'] },
        { id: 'profession', label: 'Profession', type: 'bubble-input', options: ['Salaried', 'Founder / Entrepreneur', 'Business Owner', 'Freelancer / Consultant', 'Professional (CA/Dr/Lawyer)', 'Student'] },
        { id: 'salary', label: 'Your Annual Income Range', type: 'bubble', options: ['< 10 LPA', '10-30 LPA', '30-50 LPA', '50 LPA - 1 Cr', '1 Cr - 2 Cr', '> 2 Cr'] },
        { id: 'married', label: 'Marital Status', type: 'bubble', options: ['Single', 'Married'] },

        // ─ If Single, ask about dependents ─
        ...(formData.married === 'Single' ? [
          { id: 'dependents', label: 'Do you financially support anyone?', type: 'multi-bubble', options: ['Parents', 'Siblings', 'No one'] }
        ] : [])
      ]
    },

    // ─── SECTION 2: Family & Household (Conditional — Married) ───
    ...(formData.married === 'Married' ? [{
      id: 'family',
      title: 'Family & Household',
      questions: [
        { id: 'workingSpouse', label: 'Is your spouse working?', type: 'bubble', options: yesNo },
        
        // Combined household income — the key ask
        ...(formData.workingSpouse === 'Yes' ? [
          { id: 'householdIncome', label: 'Combined Household Income Range', type: 'bubble', options: ['< 20 LPA', '20-50 LPA', '50 LPA - 1 Cr', '1-2 Cr', '2-5 Cr', '> 5 Cr'] }
        ] : []),

        { id: 'kids', label: 'Number of Kids', type: 'counter' },
        { id: 'dependents', label: 'Do you financially support others?', type: 'multi-bubble', options: ['Parents', 'In-laws', 'Siblings', 'No one else'] },
        { id: 'jointAccount', label: 'Do you hold any Joint Accounts (Bank / Investments)?', type: 'multi-bubble', options: ['Yes - with Spouse', 'Yes - with Parents', 'No'] },
        
        // WHY: No joint accounts but married — why manage separately?
        ...(formData.jointAccount && formData.jointAccount.includes('No') && formData.jointAccount.length === 1 ? [
          { id: 'whyNoJoint', label: 'Why do you keep finances completely separate?', type: 'bubble-input', options: ['Independence / preference', 'Different spending habits', 'Never thought about it', 'Complexity of merging'] }
        ] : []),

        { id: 'financialDecisionMaker', label: 'Who manages finances at home?', type: 'bubble', options: ['I do', 'Spouse does', 'We both do equally', 'Parents / Family'] }
      ]
    }] : []),

    // ─── SECTION 3: Money Mindset & Goals ───
    {
      id: 'financialHealth',
      title: 'Money & Goals',
      questions: [
        { id: 'moneyPersonality', label: 'How would you describe yourself with money?', type: 'bubble', options: ['Saver', 'Investor', 'Spender', 'Anxious about it', 'Set it & forget it'] },
        { id: 'financialLiteracy', label: 'How would you rate your financial knowledge?', type: 'bubble', options: ['1 — Clueless', '2 — Beginner', '3 — Moderate', '4 — Confident', '5 — Expert'] },
        { id: 'financialGoals', label: 'Top Financial Goals?', type: 'multi-bubble-input', options: ['Retirement', 'Buying a Home', 'Kids Education', 'Early Financial Freedom (FIRE)', 'Luxury Travel', 'Wealth Creation', 'Emergency Fund'] },
        { id: 'emergencyFund', label: 'Do you have an Emergency Fund?', type: 'bubble', options: ['Yes - 6+ months', 'Yes - 3-6 months', 'Yes - < 3 months', 'No'] },
        
        // WHY: No emergency fund but has kids — risky behavior
        ...(formData.emergencyFund === 'No' && formData.kids > 0 ? [
          { id: 'whyNoEmergencyFund', label: 'With a family, why no emergency fund?', type: 'bubble-input', options: ['Haven\'t gotten around to it', 'All money is invested', 'Rely on family support', 'Don\'t know how much to keep'] }
        ] : []),

        { id: 'salarySplitInvest', label: 'What % of income goes to Investments?', type: 'bubble', options: ['< 10%', '10-30%', '30-50%', '> 50%'] },
        { id: 'salarySplitEMI', label: 'What % goes to EMIs / Debt?', type: 'bubble', options: ['0% (Debt Free)', '< 20%', '20-40%', '> 40%'] },
        
        // WHY: Very high EMI burden
        ...(formData.salarySplitEMI === '> 40%' ? [
          { id: 'highEMIReason', label: '40%+ on EMIs is significant. What are these for?', type: 'multi-bubble-input', options: ['Home Loan', 'Car Loan', 'Education Loan', 'Personal Loan', 'Credit Card Dues', 'Multiple loans stacking up'] }
        ] : []),

        // WHY: High income but very low investment
        ...((formData.salary === '50 LPA - 1 Cr' || formData.salary === '1 Cr - 2 Cr' || formData.salary === '> 2 Cr') && formData.salarySplitInvest === '< 10%' ? [
          { id: 'whyLowInvest', label: 'With your income level, why is only <10% going to investments?', type: 'bubble-input', options: ['High lifestyle expenses', 'High EMIs / Debt', 'Don\'t know where to invest', 'Recently started earning', 'Saving for a big purchase', 'Procrastination'] }
        ] : []),

        { id: 'investmentStyle', label: 'How do you typically invest?', type: 'bubble', options: ['Mostly Regular (SIPs)', 'Mostly Lumpsum (Bonuses)', 'Mix of both', 'Don\'t invest yet'] },
        { id: 'biggestMoneyMistake', label: 'Biggest financial mistake you\'ve made?', type: 'multi-bubble-input', options: ['Not starting early', 'Wrong investment (lost money)', 'Too much in FD / Savings', 'Taking too much loan', 'Trusting wrong advisor', 'No insurance', 'None yet'] }
      ]
    },

    // ─── SECTION 4: Banking & Payments ───
    {
      id: 'banking',
      title: 'Banking & Payments',
      questions: [
        { id: 'bankAc', label: 'Bank Account(s)', type: 'multi-bubble-input', options: commonBanks },
        ...(formData.bankAc && formData.bankAc.length > 1 ? [{ id: 'bankMultiReason', label: 'Why multiple bank accounts?', type: 'multi-bubble-input', options: ['Salary Account', 'Better Rates / Offers', 'Safety / Diversification', 'Old accounts still open'] }] : []),
        { id: 'cashInSavings', label: 'Cash sitting in Savings (Lakhs)', type: 'bubble', options: ['< 1L', '1-5L', '5-10L', '10-25L', '> 25L'] },
        
        // WHY: Large amount idle in savings
        ...(formData.cashInSavings && ['5-10L', '10-25L', '> 25L'].includes(formData.cashInSavings) ? [{ id: 'cashReason', label: `Why keep ${formData.cashInSavings} in Savings?`, type: 'bubble-input', options: ['Emergency Fund', 'Upcoming Expense', 'Haven\'t gotten around to investing', 'Safety / Trust', 'Need Liquidity', 'Lazy / Don\'t know better options'] }] : []),

        { id: 'paymentModes', label: 'Primary Payment Modes', type: 'multi-bubble', options: paymentModes },
        { id: 'autoPay', label: 'Do you use Auto-pay for bills?', type: 'bubble', options: ['Yes - all bills', 'Some bills', 'No - prefer manual'] },
        ...(formData.autoPay === 'No - prefer manual' ? [{ id: 'autoPayReason', label: 'Why prefer manual?', type: 'bubble-input', options: ['Control / Trust issues', 'Variable amounts', 'Fear of overdraft', 'Want to check bills first'] }] : []),
        ...(formData.autoPay === 'Some bills' ? [{ id: 'autoPayPartialReason', label: 'Why not auto-pay for all?', type: 'bubble-input', options: ['Variable amounts', 'Fear of overdraft', 'Verify before paying', 'Only fixed bills on auto'] }] : []),

        // WHY: High income but no auto-pay — unusual
        ...((formData.salary === '50 LPA - 1 Cr' || formData.salary === '1 Cr - 2 Cr' || formData.salary === '> 2 Cr') && formData.autoPay === 'No - prefer manual' ? [
          { id: 'highIncomeNoAutoPay', label: 'With your income, manual bill paying is rare — what\'s the concern?', type: 'bubble-input', options: ['Had a bad auto-debit experience', 'Want visibility on every charge', 'Don\'t trust the system', 'Just habit'] }
        ] : [])
      ]
    },

    // ─── SECTION 5: Credit Cards (Conditional) ───
    ...(formData.paymentModes?.includes('Credit Card') ? [{
      id: 'ccDetails',
      title: 'Credit Cards',
      questions: [
        { id: 'ccCount', label: 'How many credit cards?', type: 'counter' },
        { id: 'ccNames', label: 'Which cards do you hold?', type: 'multi-bubble-input', options: [
            'HDFC Infinia', 'HDFC DCB', 'HDFC Regalia/Gold', 'HDFC Millennia', 'HDFC Swiggy',
            'SBI Cashback', 'SBI Prime/Elite', 'SBI SimplyClick',
            'Axis Magnus', 'Axis Atlas', 'Axis ACE', 'Axis Flipkart',
            'ICICI Amazon Pay', 'ICICI Emerald', 'ICICI Sapphiro/Rubyx',
            'Amex Platinum Travel', 'Amex MRCC', 'Amex Gold/Charge',
            'OneCard', 'Tata Neu'
          ] 
        },
        { id: 'ccBillPay', label: 'Do you always pay full CC bill on time?', type: 'bubble', options: ['Yes - always full', 'Usually full', 'Sometimes minimum', 'Often revolve balance'] },
        
        // WHY: Revolving CC balance — dangerous behavior
        ...(formData.ccBillPay === 'Sometimes minimum' || formData.ccBillPay === 'Often revolve balance' ? [
          { id: 'whyRevolve', label: 'Why not pay in full? (CC interest is 36-42% PA)', type: 'bubble-input', options: ['Cash flow crunch', 'Unplanned expenses', 'Habit / lazy', 'Didn\'t realize the interest rate', 'EMI conversions are OK'] }
        ] : []),

        { id: 'ccOptimisation', label: 'Do you optimize for rewards?', type: 'bubble', options: ['Yes - Actively', 'Somewhat', 'No'] },
        { id: 'ccResearch', label: 'How do you pick new cards?', type: 'multi-bubble-input', options: researchSources }
      ]
    }] : []),

    // ─── SECTION 6: Loans & Debt (Conditional based on EMI status) ───
    ...(formData.salarySplitEMI !== '0% (Debt Free)' ? [{
      id: 'loans',
      title: 'Loans & Debt',
      questions: [
        { id: 'activeLoans', label: 'Do you have any active loans?', type: 'multi-bubble', options: ['Home Loan', 'Car Loan', 'Education Loan', 'Personal Loan', 'Gold Loan', 'None'] },
        
        // Home Loan deep dive
        ...(formData.activeLoans?.includes('Home Loan') ? [
          { id: 'homeLoanOutstanding', label: 'Home Loan outstanding', type: 'bubble', options: ['< 25L', '25-50L', '50L-1Cr', '1-2Cr', '> 2Cr'] },
          { id: 'homeLoanRate', label: 'Interest rate', type: 'bubble', options: ['< 7%', '7-8%', '8-9%', '> 9%', 'Not sure'] },
          // WHY: Not sure about their own loan rate
          ...(formData.homeLoanRate === 'Not sure' ? [
            { id: 'whyUnsureLoanRate', label: 'Why don\'t you know your own loan rate?', type: 'bubble-input', options: ['Never checked after taking it', 'Family manages it', 'Too many things to track', 'Doesn\'t matter to me'] }
          ] : []),
          { id: 'homeLoanReview', label: 'Have you ever refinanced / renegotiated?', type: 'bubble', options: ['Yes', 'No - didn\'t know I could', 'No - too much hassle', 'No - rate is already good'] }
        ] : []),

        // Personal Loan — WHY
        ...(formData.activeLoans?.includes('Personal Loan') ? [
          { id: 'personalLoanReason', label: 'Why did you take a Personal Loan?', type: 'bubble-input', options: ['Emergency', 'Wedding', 'Consolidating other debt', 'Big purchase', 'Travel', 'Business needs'] },
          { id: 'personalLoanRate', label: 'Interest rate on Personal Loan?', type: 'bubble', options: ['< 12%', '12-16%', '16-20%', '> 20%', 'Not sure'] }
        ] : []),

        // If no loans at all — interesting insight
        ...(formData.activeLoans?.includes('None') ? [
          { id: 'debtFreeReason', label: 'Debt-free by choice or circumstance?', type: 'bubble-input', options: ['Principle — never borrow', 'Paid off everything', 'Haven\'t needed one yet', 'Parents helped financially', 'Rent instead of own'] }
        ] : []),
        
        // Total EMI tracking
        ...(formData.activeLoans && !formData.activeLoans.includes('None') && formData.activeLoans.length > 0 ? [
          { id: 'emiTracking', label: 'How do you track all your EMIs?', type: 'bubble-input', options: ['Bank app reminders', 'Auto-debit / don\'t think about it', 'Spreadsheet', 'CA / Advisor tracks', 'Mental notes / memory'] },
          { id: 'emiPrepayment', label: 'Do you make prepayments when you get bonus / extra cash?', type: 'bubble', options: ['Yes - always', 'Sometimes', 'No - prefer to invest', 'No - never thought about it'] }
        ] : [])
      ]
    }] : []),

    // ─── SECTION 7: Investment Portfolio Split ───
    {
      id: 'investments',
      title: 'Investment Portfolio',
      questions: [
        { 
          id: 'investments', 
          label: 'What is your portfolio allocation? (Must sum to 100%)', 
          type: 'box-split', 
          options: ['Fixed Deposits', 'Mutual Funds', 'Stocks', 'PMS / AIF', 'Real Estate', 'Crypto', 'Gold', 'Other'] 
        },
        ...(formData.investments && formData.investments.length > 0 ? [{
           id: 'portfolioDecision',
           label: 'How did you arrive at this split?',
           type: 'bubble-input',
           options: ['Age-based rule of thumb', 'Risk Appetite', 'Goal-based timeline', 'Advisor / Wealth Manager', 'Opportunistic / no framework', 'Tax efficiency driven']
        }] : []),
        ...(formData.investments && formData.investments.length > 0 ? [{
          id: 'portfolioReviewFreq',
          label: 'How often do you review your overall portfolio?',
          type: 'bubble',
          options: ['Monthly', 'Quarterly', 'Annually', 'Only when market crashes', 'Never']
        }] : []),
        // WHY: Never reviews portfolio
        ...(formData.portfolioReviewFreq === 'Never' ? [{
          id: 'whyNeverReview', label: 'Why do you never review?', type: 'bubble-input', options: ['Don\'t know how', 'Too many accounts / apps', 'No time', 'Trust my advisor', 'Set and forget']
        }] : [])
      ]
    },

    // ─── SECTION 8: Fixed Deposits Deep Dive ───
    ...(formData.investments?.includes('Fixed Deposits') ? [{
      id: 'fdDetails',
      title: 'Fixed Deposits',
      questions: [
        { id: 'fdWhere', label: 'Where do you hold FDs?', type: 'multi-bubble-input', options: ['Salary Bank', 'Best Rate Bank', 'Small Finance Bank', 'Corporate FDs', 'Post Office'] },
        { id: 'fdInterest', label: 'What interest rate are you getting?', type: 'bubble', options: ['< 6%', '6-7%', '7-8%', '> 8%', 'Not sure'] },
        { id: 'reasonForFD', label: 'Why FDs?', type: 'multi-bubble-input', options: ['Safety', 'Liquidity', 'Parents Advice', 'Short-term parking', 'Tax Saving (5yr)', 'Better than Savings'] },
        { id: 'fdReview', label: 'How often do you review / renew?', type: 'bubble', options: ['On maturity only', 'Annually', 'Actively compare rates', 'Never thought about it'] },
        // WHY: FD is majority allocation for young earners
        ...(formData.age === '18-24' || formData.age === '25-34' ? [
          ...(parseInt(formData['investments_Fixed Deposits'] || 0) >= 40 ? [
            { id: 'whyHeavyFD', label: 'You\'re young with 40%+ in FDs — have you considered equity for long-term growth?', type: 'bubble', options: ['Yes, but too risky', 'Don\'t know how to start', 'Advisor put me here', 'Will shift soon', 'Happy with guaranteed returns'] }
          ] : [])
        ] : [])
      ]
    }] : []),

    // ─── SECTION 9: Mutual Funds Deep Dive ───
    ...(formData.investments?.includes('Mutual Funds') ? [{
      id: 'mfDetails',
      title: 'Mutual Funds',
      questions: [
        { id: 'mfPlatform', label: 'Platform(s) used', type: 'multi-bubble-input', options: platforms },
        ...(formData.mfPlatform && formData.mfPlatform.length > 1 ? [{ id: 'mfMultiReason', label: 'Why multiple platforms?', type: 'multi-bubble-input', options: ['Better UI/Features', 'Diversification/Safety', 'Migrated to new one', 'Different goals per platform'] }] : []),
        { id: 'mfType', label: 'Types of MF you invest in', type: 'multi-bubble-input', options: ['Large Cap', 'Mid/Small Cap', 'Index Funds', 'Debt Funds', 'ELSS (Tax Saving)', 'Sectoral/Thematic', 'Not sure of categories'] },
        { id: 'sip_percent', label: 'SIP as % of monthly income', type: 'bubble', options: ['< 10%', '10-20%', '20-30%', '> 30%', 'No SIP - Lumpsum only'] },

        // WHY: No SIP — unusual if you're in MF
        ...(formData.sip_percent === 'No SIP - Lumpsum only' ? [
          { id: 'whyNoSIP', label: 'Why no SIP?', type: 'bubble-input', options: ['Income is variable', 'Prefer timing the market', 'Don\'t believe in SIPs', 'Didn\'t know about SIPs', 'Invest only when I have surplus'] }
        ] : []),

        ...(formData.sip_percent !== 'No SIP - Lumpsum only' ? [
          { id: 'noOfSIPs', label: 'Active SIPs', type: 'counter' }
        ] : []),
        { id: 'mfDecision', label: 'How do you pick which fund?', type: 'multi-bubble-input', options: ['Past Returns', 'Star Ratings (Morningstar)', 'Advisor / Distributor', 'YouTube / Social Media', 'Fund Manager reputation', 'Just Index Funds', 'Self Research'] },

        // WHY: Using distributor (Regular plans) — leaving money on table
        ...(formData.mfDecision?.includes('Advisor / Distributor') ? [
          { id: 'regularVsDirect', label: 'Are your funds Regular or Direct plans?', type: 'bubble', options: ['All Direct', 'All Regular', 'Mix', 'What\'s the difference?'] }
        ] : []),

        { id: 'trackXIRR', label: 'Do you track returns (XIRR)?', type: 'bubble', options: ['Yes - regularly', 'Occasionally', 'Only absolute returns', 'What is XIRR?'] },
        { id: 'mfRebalancing', label: 'Rebalancing frequency', type: 'bubble', options: ['Monthly', 'Quarterly', 'Annually', 'Never'] },

        // WHY: Never rebalances
        ...(formData.mfRebalancing === 'Never' ? [
          { id: 'whyNoRebalance', label: 'Why no rebalancing?', type: 'bubble-input', options: ['Don\'t know how', 'Too many funds', 'No time', 'Don\'t think it matters', 'Advisor should do it but doesn\'t'] }
        ] : [])
      ]
    }] : []),

    // ─── SECTION 10: Stocks Deep Dive ───
    ...(formData.investments?.includes('Stocks') ? [{
      id: 'stockDetails',
      title: 'Stocks',
      questions: [
        { id: 'stocksPlatform', label: 'Trading platform(s)', type: 'multi-bubble-input', options: platforms },
        ...(formData.stocksPlatform && formData.stocksPlatform.length > 1 ? [{ id: 'stockMultiReason', label: 'Why multiple brokers?', type: 'multi-bubble-input', options: ['Long-term vs Trading', 'Better Charges', 'Safety / Resilience', 'Specific Features (Charts)', 'Migrated to new app'] }] : []),
        { id: 'stockFreq', label: 'Trading frequency', type: 'bubble', options: ['Daily', 'Weekly', 'Monthly', 'Long Term Holder'] },
        { id: 'stockDecision', label: 'How do you pick stocks?', type: 'multi-bubble-input', options: ['Fundamental Analysis', 'Technical Charts', 'Tips (Friends/Telegram)', 'Screeners (Trendlyne/Ticker)', 'Follow Big Investors', 'News/Events driven', 'Self Research'] },

        // WHY: Tips-based investing — behavioral insight
        ...(formData.stockDecision?.includes('Tips (Friends/Telegram)') ? [
          { id: 'tipsDamage', label: 'Have tip-based trades ever caused you significant loss?', type: 'bubble', options: ['Yes - major loss', 'Yes - minor losses', 'No - been lucky', 'Still do it anyway'] }
        ] : []),

        { id: 'stockHowMuch', label: 'How do you decide position size?', type: 'bubble-input', options: ['Equal weight all', 'Conviction based', 'Fixed amount per bet', 'No real framework', 'Advisor driven'] },
        { id: 'stockTrack', label: 'How do you track performance?', type: 'bubble-input', options: ['Broker app', 'Google Sheets / Excel', 'Smallcase / Tickertape', 'Portfolio tracker app', 'Don\'t track regularly'] },
        { id: 'watchlist', label: 'Do you maintain a watchlist?', type: 'bubble', options: yesNo }
      ]
    }] : []),

    // ─── SECTION 11: PMS / AIF Deep Dive ───
    ...(formData.investments?.includes('PMS / AIF') ? [{
      id: 'pmsDetails',
      title: 'PMS / AIF',
      questions: [
        { id: 'pmsType', label: 'Type of service', type: 'multi-bubble', options: ['Manager decides everything (Discretionary PMS)', 'I approve each trade (Non-Discretionary PMS)', 'AIF Category 1/2', 'AIF Category 3'] },
        { id: 'pmsDecision', label: 'How did you decide to go with PMS/AIF?', type: 'bubble-input', options: ['Wealth Manager recommended', 'Self research', 'Friends / Peers invested', 'Tax structuring', 'Wanted professional management'] },
        { id: 'pmsReturn', label: 'What returns are they delivering vs expectation?', type: 'textarea', placeholder: 'e.g. Expected 18%, getting 12%...' },
        { id: 'pmsFees', label: 'Fee model', type: 'bubble', options: ['Fixed Fee', 'Profit Sharing', 'Both (Fixed + Carry)', 'Not sure'] },
        { id: 'pmsSatisfaction', label: 'Satisfaction?', type: 'bubble', options: satisfaction },

        // WHY: Dissatisfied but still using
        ...(formData.pmsSatisfaction === 'Dissatisfied' ? [
          { id: 'whyStillPMS', label: 'If dissatisfied, why still with them?', type: 'bubble-input', options: ['Lock-in period', 'Too much hassle to move', 'Don\'t know where else to go', 'Hoping it improves', 'Tax implications on exit'] }
        ] : [])
      ]
    }] : []),

    // ─── SECTION 12: Real Estate ───
    ...(formData.investments?.includes('Real Estate') ? [{
      id: 'reDetails',
      title: 'Real Estate',
      questions: [
        { id: 'reType', label: 'Type of RE investment', type: 'multi-bubble', options: ['Primary Home', 'Second Home', 'Rental Property', 'Commercial', 'Land / Plot', 'REITs / Fractional'] },
        { id: 'reDecision', label: 'Why Real Estate?', type: 'bubble-input', options: ['Tangible asset / trust', 'Rental income', 'Tax benefits', 'Family advice', 'Wealth diversification', 'Appreciation'] },
        { id: 'reReview', label: 'How often do you review valuations?', type: 'bubble', options: ['Regularly', 'Annually', 'Only when selling', 'Never'] }
      ]
    }] : []),

    // ─── SECTION 13: Crypto ───
    ...(formData.investments?.includes('Crypto') ? [{
      id: 'cryptoDetails',
      title: 'Crypto',
      questions: [
        { id: 'cryptoPlatform', label: 'Platform(s)', type: 'multi-bubble-input', options: ['WazirX', 'CoinDCX', 'Binance', 'CoinSwitch', 'Zebpay'] },
        { id: 'cryptoType', label: 'What do you hold?', type: 'multi-bubble-input', options: ['Bitcoin', 'Ethereum', 'Altcoins', 'Stablecoins', 'NFTs'] },
        { id: 'cryptoDecision', label: 'How do you decide what to buy?', type: 'bubble-input', options: ['FOMO / Hype', 'Technical Analysis', 'Long-term belief', 'Small speculative bets', 'Community / Twitter driven'] },
        { id: 'cryptoTaxAware', label: 'Are you aware of 30% crypto tax + 1% TDS in India?', type: 'bubble', options: ['Yes - factor it in', 'Yes - but don\'t care', 'Vaguely aware', 'No idea'] },
        { id: 'cryptoReview', label: 'How often do you check?', type: 'bubble', options: ['Multiple times a day', 'Daily', 'Weekly', 'Rarely - just holding'] }
      ]
    }] : []),

    // ─── SECTION 14: Gold ───
    ...(formData.investments?.includes('Gold') ? [{
      id: 'goldDetails',
      title: 'Gold',
      questions: [
        { id: 'goldType', label: 'Form of Gold', type: 'multi-bubble', options: ['Physical (Jewellery)', 'Physical (Coins/Bars)', 'Sovereign Gold Bonds', 'Gold ETF / MF', 'Digital Gold'] },
        { id: 'goldDecision', label: 'Why Gold?', type: 'bubble-input', options: ['Hedge against inflation', 'Cultural / Family tradition', 'Portfolio diversification', 'Safe haven', 'Tax efficient (SGB)'] },
        { id: 'goldReview', label: 'How often do you review?', type: 'bubble', options: ['Regularly', 'Annually', 'During market crashes', 'Never'] }
      ]
    }] : []),

    // ─── SECTION 15: Why No PMS? (High Income, No PMS) ───
    ...((formData.salary === '> 2 Cr' || formData.salary === '1 Cr - 2 Cr') && !formData.investments?.includes('PMS / AIF') ? [{
      id: 'whyNoPMS',
      title: 'A Quick Question',
      questions: [
        { id: 'reasonNoPMS', label: 'With your income level, have you considered PMS / AIF?', type: 'bubble-input', options: ['Not aware of it', 'Minimum ticket size too high', 'Prefer direct equity control', 'Trust issues with fund managers', 'Fees too high / poor returns', 'Happy with MF / Stocks'] }
      ]
    }] : []),

    // ─── SECTION 16: Insurance ───
    {
      id: 'insurance',
      title: 'Insurance',
      questions: [
        { id: 'insuranceTypes', label: 'What insurance do you hold?', type: 'multi-bubble', options: insuranceTypes },

        // WHY: No insurance but married with kids — critical gap
        ...(formData.insuranceTypes?.includes('None') && formData.married === 'Married' ? [
          { id: 'whyNoInsurance', label: 'No insurance with a family — any specific reason?', type: 'bubble-input', options: ['Too expensive', 'Employer covers me', 'Don\'t believe in it', 'Been meaning to but haven\'t', 'Don\'t know what to buy'] }
        ] : []),

        // WHY: No health insurance specifically
        ...(formData.insuranceTypes && !formData.insuranceTypes.includes('None') && !formData.insuranceTypes.includes('Health') ? [
          { id: 'whyNoHealth', label: 'You don\'t have Health Insurance — why?', type: 'bubble-input', options: ['Employer covers me', 'Young & healthy', 'Too expensive', 'Don\'t know which one', 'Will get it later'] }
        ] : []),

        ...(formData.insuranceTypes && !formData.insuranceTypes?.includes('None') && formData.insuranceTypes?.length > 0 ? [
          { id: 'insuranceDiscovery', label: 'How did you find / buy policies?', type: 'multi-bubble-input', options: ['Agent', 'PolicyBazaar / Aggregator', 'Bank Cross-sell', 'Corporate / Employer', 'Self Research'] },
          { id: 'insuranceAdequacy', label: 'Do you feel adequately covered?', type: 'bubble', options: ['Yes', 'Probably not', 'Not sure', 'Definitely under-insured'] },
          
          // WHY: Under-insured (Probably or Definitely)
          ...(['Definitely under-insured', 'Probably not'].includes(formData.insuranceAdequacy) ? [
            { id: 'whyUnderInsured', label: 'What makes you feel under-insured?', type: 'bubble-input', options: ['Rely mainly on employer cover', 'Premium costs too high', 'Haven\'t reviewed in years', 'Family needs have grown', 'Just a gut feeling'] }
          ] : []),

          // WHY: Not sure
          ...(formData.insuranceAdequacy === 'Not sure' ? [
            { id: 'whyUnsureInsurance', label: 'Why the uncertainty?', type: 'bubble-input', options: ['Don\'t know how to calculate needs', 'Agent handled it all', 'Confusing policy terms', 'Never made a claim yet'] }
          ] : [])
        ] : [])
      ]
    },

    // ─── SECTION 17: Taxes — Current Method ───
    {
      id: 'taxes',
      title: 'Taxes & Filing',
      questions: [
        { id: 'taxRegime', label: 'Which tax regime do you use?', type: 'bubble', options: ['Old Regime', 'New Regime', 'Not sure'] },
        
        // WHY: Not sure about their own regime
        ...(formData.taxRegime === 'Not sure' ? [
          { id: 'whyUnsureRegime', label: 'Not knowing your tax regime means potential savings are being missed. Who decides for you?', type: 'bubble-input', options: ['CA decides / I trust them', 'Employer chooses default', 'Never compared both', 'Too confusing'] }
        ] : []),

        { id: 'taxFiling', label: 'How do you file taxes?', type: 'bubble-input', options: ['Self (Govt Portal)', 'Online Portal (ClearTax etc.)', 'CA', 'Family Member', 'Service provided by Employer'] },
        
        // Conditional fee question
        ...((formData.taxFiling === 'CA' || formData.taxFiling?.includes('Portal')) ? [{ 
          id: 'taxFilingFee', 
          label: `How much do you pay for ${formData.taxFiling === 'CA' ? 'CA' : 'Portal'} services annually?`, 
          type: 'bubble-input', 
          options: ['< 1k', '1k-3k', '3k-5k', '5k-10k', '> 10k'] 
        }] : []),

        ...(formData.taxFiling === 'CA' ? [{ 
          id: 'caProactive', 
          label: 'Does your CA proactively suggest tax optimization?', 
          type: 'bubble', 
          options: ['Yes', 'No', 'Sometimes'] 
        }] : []),

        // WHY: CA doesn't optimize but still using them
        ...(formData.caProactive === 'No' ? [
          { id: 'whyKeepCA', label: 'If your CA doesn\'t optimize taxes, why stay with them?', type: 'bubble-input', options: ['Family CA / loyalty', 'Too much hassle to switch', 'Don\'t know better options', 'They\'re cheap', 'CA is fine for filing, I don\'t expect more'] }
        ] : []),

        { id: 'taxOptimization', label: 'Do you actively plan for tax saving / optimization?', type: 'bubble', options: ['Yes - Comprehensive', 'Only 80C / Basics', 'No - Pay as per demand'] },
        { id: 'taxHarvesting', label: 'Do you do Tax Loss Harvesting?', type: 'bubble', options: ['Yes - Manually', 'Yes - Advisor does it', 'No', 'What is that?'] },
        { id: 'taxSatisfaction', label: 'Satisfaction with current tax filing?', type: 'bubble', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] }
      ]
    },

    // ─── SECTION 18: Tax Automation Readiness ───
    {
      id: 'taxAutomation',
      title: 'Automated Tax Filing',
      questions: [
        { id: 'aggregatorOpenness', label: 'Would you use Account Aggregator (OTP-based fetch) for auto tax filing?', type: 'bubble', options: ['Yes, comfortable', 'Maybe if secure', 'No, privacy concern'] },
        { id: 'emailShare', label: 'Would you share read-only email access for tax statements?', type: 'bubble', options: ['Yes', 'Maybe with controls', 'No'] },
        
        // WHY: Won't share anything — trust issue
        ...(formData.aggregatorOpenness === 'No, privacy concern' && formData.emailShare === 'No' ? [
          { id: 'whyNoDataShare', label: 'What would make you comfortable sharing data?', type: 'bubble-input', options: ['Govt-backed platform', 'Data deleted after filing', 'Trusted brand (Google/Apple level)', 'Nothing - will never share', 'On-device processing only'] }
        ] : []),

        { id: 'willingToPayTax', label: 'How much would you pay for automated tax filing?', type: 'bubble', options: ['Free only', '< 500 INR', '500-1500 INR', '> 1500 INR'] }
      ]
    },

    // ─── SECTION 19: Product Vision — Unified Dashboard ───
    {
      id: 'commandConcept',
      title: 'One Dashboard for Everything',
      questions: [
        { id: 'painPoints', label: 'Biggest financial pain point today?', type: 'multi-bubble-input', options: ['Tracking Net Worth', 'Too many apps / logins', 'Tax Filing Complexity', 'No consolidated view', 'Payment Management', 'Don\'t know if I\'m on track'] },
        { id: 'singleView', label: 'Would you use a single dashboard to view all assets (Bank, Stocks, FD, MF, Insurance)?', type: 'bubble', options: ['Yes! Need this', 'Maybe', 'No, happy with separate apps'] },

        // WHY: Not interested despite having pain points
        ...(formData.singleView === 'No, happy with separate apps' && formData.painPoints?.length > 0 ? [
          { id: 'whyNoDashboard', label: 'You mentioned pain points but don\'t want a dashboard — why?', type: 'bubble-input', options: ['Security concern - all eggs one basket', 'Tried one before, didn\'t work', 'Too lazy to set up', 'Don\'t trust startups with money data', 'Happy with my spreadsheet'] }
        ] : [])
      ]
    },

    // ─── SECTION 20: Automation Features (Conditional) ───
    ...(formData.singleView === 'Yes! Need this' || formData.singleView === 'Maybe' ? [{
      id: 'commandDeepDive',
      title: 'Automation Features',
      questions: [
        { id: 'oneButtonPay', label: 'Would you use a "One Button" to clear all monthly bills?', type: 'bubble', options: ['Yes, definitely', 'Maybe', 'Sounds risky'] },
        { id: 'autoInvest', label: 'Would you trust auto-move of idle cash to higher-yield instruments?', type: 'bubble', options: ['Yes', 'Only with my approval each time', 'No'] },
        { id: 'autoRebalance', label: 'Would you want automatic portfolio rebalancing alerts?', type: 'bubble', options: ['Yes - auto rebalance', 'Yes - but just alerts', 'No'] },
        { id: 'aiAdvisor', label: 'Would you use an AI advisor that gives personalized financial advice?', type: 'bubble', options: ['Yes - excited about it', 'Maybe - if trustworthy', 'No - prefer human advisors'] }
      ]
    }] : []),

    // ─── SECTION 21: Tool Expectations ───
    {
      id: 'toolExpectations',
      title: 'Expectations from a Holistic Tool',
      questions: [
        { id: 'criticalFeatures', label: 'What features are absolutely critical for you?', type: 'multi-bubble-input', options: ['Real-time Net Worth', 'Tax Planning & Filing', 'Investment Advice', 'Expense Tracking', 'Bill Payments', 'Family Portfolio View', 'Loan Management', 'Goal Tracking'] },
        { id: 'dataPrivacy', label: 'How comfortable are you sharing investment data for better insights?', type: 'bubble', options: ['Very Comfortable (if secure)', 'Comfortable with read-only', 'Hesitant', 'Not Comfortable'] },
        { id: 'interactionPreference', label: 'Preferred way to interact?', type: 'bubble', options: ['Mobile App', 'Web Dashboard', 'WhatsApp / Chatbot', 'Weekly Email Reports'] },
        { id: 'advisoryStyle', label: 'What kind of advice do you prefer?', type: 'bubble', options: ['Fully Automated (AI)', 'Hybrid (Tech + Human Expert)', 'Do it yourself (Tools only)'] }
      ]
    },

    // ─── SECTION 22: Closing ───
    {
      id: 'closing',
      title: 'Closing Thoughts',
      questions: [
        { id: 'viewOnProduct', label: 'Interest in a holistic personal finance tool?', type: 'bubble', options: ['Highly Interested', 'Moderately Interested', 'Somewhat', 'Not Interested'] },
        { id: 'willingnessToPay', label: 'What would you pay annually?', type: 'bubble', options: ['Free only', '< 1k/yr', '1k-3k/yr', '> 3k/yr'] },
        { id: 'userSuggestions', label: 'Anything we missed? Suggestions?', type: 'textarea' }
      ]
    },


    // ─── SECTION 23: Join Waitlist + Support ───
    {
      id: 'waitlist',
      title: 'Take Command',
      questions: [
        { 
          id: 'waitlist', 
          label: '', 
          type: 'waitlist-cta',
          content: {
            lines: [
              { text: 'You take 100+ financial decisions a year.', highlight: false },
              { text: 'You have access to everything.', highlight: false },
              { text: 'You understand nothing.', highlight: false },
              { text: 'You make sub-optimal decisions.', highlight: false },
              { text: 'Every. Single. Year.', highlight: false },
              { text: 'Lack of visibility. Lack of advice.', highlight: false },
            ],
            conclusion: 'Command is your personal finance agent.',
            sub: 'Acts like you. Not the bank. Not the broker. YOU.',
            benefit: 'Get Early Access + Founder Status'
          }
        }
      ]
    }
  ];

  const currentSection = sections[step];
  const isLastStep = step === sections.length - 1;

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(formData).join(",") + "\n" 
      + Object.values(formData).map(v => Array.isArray(v) ? `"${v.join(';')}"` : `"${v}"`).join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `survey_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitSurvey = async () => {
    console.log(formData);
    
    // REPLACE WITH YOUR GOOGLE APPS SCRIPT URL
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyDNKzn8s_UcPLW7f-dbenda0UxJ0UXzKAR5RusVFOy_DmDKqrHL6EhFry9hly8qILb2g/exec"; 
    
    try {
      if (GOOGLE_SCRIPT_URL !== "YOUR_WEB_APP_URL_HERE") {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", // Important to avoid CORS errors with Google Apps Script
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        console.log("Submitted to Google Sheets");
      } else {
        console.warn("Google Script URL not set. Data not saved to Sheets.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }

    downloadCSV();
    setSubmitted(true);
  };

  const handleNext = () => {
    // Validation Check
    const currentQuestions = sections[step].questions || [];
    const missingFields = currentQuestions.filter(q => {
      // Skip validation for informational types or specific optional fields
      if (q.type === 'waitlist-cta' || q.id === 'userSuggestions' || q.id === 'pmsReturn') return false; 
      
      const val = formData[q.id];
      if (Array.isArray(val)) return val.length === 0;
      return !val || val === ''; 
    });

    if (missingFields.length > 0) {
      alert(`Please answer the following before proceeding:\n- ${missingFields.map(q => q.label).join('\n- ')}`);
      return;
    }

    if (isLastStep) {
      handleSubmitSurvey();
    } else {
      nextStep();
    }
  };

  // Render different input types
  const renderInput = (q) => {
    switch (q.type) {
      case 'bubble':
        return (
          <div className="bubble-container">
            {q.options.map(opt => (
              <div 
                key={opt}
                className={`bubble ${formData[q.id] === opt ? 'selected' : ''}`}
                onClick={() => setField(q.id, opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        );
      
      case 'bubble-input':
        return (
          <div className="bubble-container-input">
             <div className="bubble-container">
              {q.options.map(opt => (
                <div 
                  key={opt}
                  className={`bubble ${formData[q.id] === opt ? 'selected' : ''}`}
                  onClick={() => setField(q.id, opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
            <input 
              type="text" 
              placeholder="Other / Type here..." 
              value={formData[q.id] || ''}
              onChange={(e) => setField(q.id, e.target.value)}
            />
          </div>
        );

      case 'multi-bubble':
        return (
          <div className="bubble-container">
            {q.options.map(opt => (
              <div 
                key={opt}
                className={`bubble ${(formData[q.id] || []).includes(opt) ? 'selected' : ''}`}
                onClick={() => toggleMultiSelect(q.id, opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        );

      case 'multi-bubble-input':
        return (
          <div className="bubble-container-input">
            <div className="bubble-container">
              {q.options.map(opt => (
                <div 
                  key={opt}
                  className={`bubble ${(formData[q.id] || []).includes(opt) ? 'selected' : ''}`}
                  onClick={() => toggleMultiSelect(q.id, opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
             <input 
              type="text" 
              placeholder="Other Reasons..." 
              value={formData[`${q.id}_other`] || ''}
              onChange={(e) => setField(`${q.id}_other`, e.target.value)}
            />
          </div>
        );

      case 'counter':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="counter-btn" onClick={() => setField(q.id, Math.max(0, (formData[q.id] || 0) - 1))}>−</button>
            <span style={{ fontSize: '1.3rem', fontWeight: '600', minWidth: '2rem', textAlign: 'center', color: 'var(--text)' }}>{formData[q.id] || 0}</span>
            <button className="counter-btn" onClick={() => setField(q.id, (formData[q.id] || 0) + 1)}>+</button>
          </div>
        );
      
      case 'range':
        return (
          <div style={{ width: '100%' }}>
             <input 
              type="range" 
              min={q.min} 
              max={q.max} 
              step={q.step}
              value={formData[q.id] || q.min} 
              onChange={handleTextChange}
              name={q.id}
            />
            <div style={{ textAlign: 'center', fontWeight: '600', fontSize: '1.1rem', color: 'var(--accent-text)', marginTop: '4px' }}>{formData[q.id] || q.min} / {q.max}</div>
          </div>
        );

      case 'textarea':
        return (
          <textarea 
            name={q.id} 
            value={formData[q.id] || ''} 
            onChange={handleTextChange}
            rows={3} 
            placeholder="Type here..."
          />
        );

      case 'box-split':
        const total = q.options.reduce((sum, opt) => sum + (parseInt(formData[`${q.id}_${opt}`] || 0) || 0), 0);
        
        const handleSliderChange = (opt, newValue) => {
          const val = parseInt(newValue) || 0;
          const otherTotal = q.options.reduce((sum, o) => {
             if (o === opt) return sum;
             return sum + (parseInt(formData[`${q.id}_${o}`] || 0) || 0);
          }, 0);
          
          // Constrain value so total doesn't exceed 100
          const maxAllowed = 100 - otherTotal;
          const constrainedVal = Math.min(val, maxAllowed);
          
          setField(`${q.id}_${opt}`, constrainedVal);

          // Update the main investments array based on non-zero values
          // We need this to conditionally show next sections
          const currentInvestments = q.options
            .filter(o => {
               const v = o === opt ? constrainedVal : (parseInt(formData[`${q.id}_${o}`] || 0) || 0);
               return v > 0; 
            });
          setField('investments', currentInvestments);
        };

        return (
          <div className="box-split-container">
            {q.options.map(opt => {
              const currentVal = parseInt(formData[`${q.id}_${opt}`] || 0) || 0;
              // Calculate max for this specific slider based on others
              const otherTotal = total - currentVal;
              const maxForThis = 100 - otherTotal;

              return (
                <div key={opt} style={{ marginBottom: '16px', padding: '12px 14px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontWeight: '500', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{opt}</label>
                    <span style={{ fontWeight: '600', fontSize: '0.88rem', color: currentVal > 0 ? 'var(--accent-text)' : 'var(--text-muted)' }}>{currentVal}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100"
                    value={currentVal}
                    onChange={(e) => handleSliderChange(opt, e.target.value)}
                    style={{ width: '100%', cursor: 'pointer', margin: '0' }}
                  />
                </div>
              );
            })}
            
            <div style={{ 
              marginTop: '16px', 
              padding: '12px 16px', 
              background: total === 100 ? 'var(--success-bg)' : 'var(--error-bg)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              border: `1px solid ${total === 100 ? 'var(--success-border)' : 'var(--error-border)'}`
            }}>
              <strong style={{ color: total === 100 ? 'var(--success)' : 'var(--error)', fontSize: '0.95rem' }}>
                Total: {total}%
              </strong>
              {total !== 100 && <span style={{ marginLeft: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>(Must sum to 100%)</span>}
            </div>

            {/* If Other has value, ask what it is */}
            {(parseInt(formData[`${q.id}_Other`] || 0) > 0) && (
              <div style={{ marginTop: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Please specify 'Other'..." 
                  value={formData[`${q.id}_Other_Text`] || ''}
                  onChange={(e) => setField(`${q.id}_Other_Text`, e.target.value)}
                />
              </div>
            )}
          </div>
        );

      case 'phone':
        return (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', padding: '4px' }}>
              <span style={{ padding: '8px 12px', color: 'var(--text-muted)', fontSize: '0.95rem', borderRight: '1px solid var(--glass-border)', flexShrink: 0 }}>+91</span>
              <input 
                type="tel" 
                name={q.id}
                value={formData[q.id] || ''} 
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setField(q.id, val);
                }}
                placeholder="10-digit mobile number"
                maxLength="10"
                style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1, padding: '8px', color: 'var(--text)', fontSize: '1rem', fontFamily: 'var(--font)' }}
              />
            </div>
            {formData[q.id] && formData[q.id].length === 10 && (
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--success)', fontSize: '1.1rem' }}>✓</span>
            )}
          </div>
        );

      case 'waitlist-cta':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>
            {/* Pitch Block */}
            {q.content && (
              <div style={{
                padding: '24px 20px',
                background: 'linear-gradient(135deg, rgba(124,92,252,0.08), rgba(167,139,250,0.04))',
                border: '1px solid rgba(124,92,252,0.2)',
                borderRadius: 'var(--radius)',
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '18px' }}>
                  {q.content.lines.map((line, i) => (
                    <p key={i} style={{
                      margin: '0 0 4px',
                      fontSize: i < 3 ? '1rem' : i === 4 ? '1.05rem' : '0.9rem',
                      fontWeight: i === 4 ? '700' : i < 3 ? '500' : '400',
                      color: i < 3 ? 'var(--text)' : i === 4 ? 'var(--accent-text)' : 'var(--text-muted)',
                      lineHeight: '1.5',
                      letterSpacing: i === 4 ? '0.04em' : 'normal'
                    }}>{line.text}</p>
                  ))}
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--text)',
                  lineHeight: '1.4',
                  marginBottom: '8px'
                }}>{q.content.conclusion}</div>
                <div style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic'
                }}>{q.content.sub}</div>
              </div>
            )}
            {/* Free Waitlist */}
            <div style={{ 
              padding: '24px 20px', 
              background: 'var(--surface)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: 'var(--radius)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>Join the Waitlist</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Be the first to know when we launch. Completely free.</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="email"
                  name="waitlistEmail"
                  placeholder="Your Email"
                  value={formData.email || ''}
                  onChange={(e) => setField('email', e.target.value)}
                   style={{
                      width: '100%',
                      maxWidth: '320px',
                      padding: '12px',
                      background: 'var(--bg)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text)',
                      fontSize: '0.95rem'
                   }}
                />
                 <input 
                  type="tel"
                  name="waitlistPhone"
                  placeholder="Your Phone Number"
                  value={formData.phone || ''}
                  onChange={(e) => {
                     const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                     setField('phone', val);
                  }}
                   style={{
                      width: '100%',
                      maxWidth: '320px',
                      padding: '12px',
                      background: 'var(--bg)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text)',
                      fontSize: '0.95rem'
                   }}
                />
              </div>

              <div style={{ 
                marginTop: '16px',
                padding: '12px 24px', 
                background: (formData.email && formData.phone) ? 'var(--accent)' : 'var(--surface-hover)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                color: (formData.email && formData.phone) ? '#fff' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: (formData.email && formData.phone) ? 'pointer' : 'not-allowed',
                transition: 'all var(--transition)'
              }}
                onClick={() => {
                  if (formData.email && formData.phone) {
                    setField('waitlistJoined', true);
                  }
                }}
              >
                {formData.waitlistJoined ? '✓ You\'re on the waitlist!' : 'Join Waitlist'}
              </div>
            </div>

            {/* Paid: Early Supporter via UPI */}
            <div style={{ 
              padding: '20px', 
              background: paymentDone ? 'var(--success-bg)' : 'linear-gradient(135deg, rgba(124, 92, 252, 0.08), rgba(167, 139, 250, 0.05))',
              border: `1px solid ${paymentDone ? 'var(--success-border)' : 'rgba(124, 92, 252, 0.25)'}`,
              borderRadius: 'var(--radius)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {!paymentDone && (
                <div style={{ 
                  position: 'absolute', top: '8px', right: '-28px', 
                  background: 'linear-gradient(135deg, var(--accent), #a78bfa)', 
                  color: 'white', fontSize: '0.65rem', fontWeight: '700',
                  padding: '3px 32px', transform: 'rotate(45deg)',
                  letterSpacing: '0.05em'
                }}>50% OFF</div>
              )}
              <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                {paymentDone ? '🎉 You\'re an Early Supporter!' : 'Become an Early Supporter'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: paymentDone ? '0' : '6px' }}>
                {paymentDone 
                  ? 'Thank you! You\'ll get 50% off on tax filing when we launch.' 
                  : 'Pay ₹100 via UPI and get 50% off on tax filing when we launch.'}
              </div>
              {!paymentDone && (
                <>
                  <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--accent-text)', margin: '10px 0 4px' }}>₹100</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '14px', textDecoration: 'line-through' }}>Tax filing at ₹1,500 → ₹750 for you</div>
                  
                  {/* UPI Pay Button */}
                  {/* QR Code */}
                  <div style={{ margin: '4px 0 16px', textAlign: 'center' }}>
                    <img src="./qr.png" alt="Scan to Pay ₹100" className="upi-qr" />
                    <p className="qr-instruction">Scan with PhonePe / GPay / Paytm</p>
                  </div>

                  {/* Or open UPI app directly */}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>— or open app directly —</div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'PhonePe', url: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${UPI_AMOUNT}&cu=INR&tn=${encodeURIComponent('Early Supporter')}`, color: '#5f259f' },
                      { label: 'GPay', url: `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${UPI_AMOUNT}&cu=INR&tn=${encodeURIComponent('Early Supporter')}`, color: '#1a73e8' },
                      { label: 'Paytm', url: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${UPI_AMOUNT}&cu=INR&tn=${encodeURIComponent('Early Supporter')}`, color: '#00b9f1' },
                    ].map(app => (
                      <a
                        key={app.label}
                        href={app.url}
                        style={{
                          padding: '10px 18px',
                          background: app.color,
                          borderRadius: 'var(--radius-sm)',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          boxShadow: `0 4px 14px ${app.color}55`,
                          transition: 'all var(--transition)',
                          flex: '1',
                          textAlign: 'center',
                          minWidth: '80px'
                        }}
                      >
                        {app.label}
                      </a>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px', textAlign: 'center' }}>
                    UPI ID: <span style={{ color: 'var(--text-secondary)', fontWeight: '500', userSelect: 'all' }}>{UPI_ID}</span>
                  </div>
                  
                  {/* After paying, enter email + UTR */}
                  <div style={{ marginTop: '8px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Your email (for 50% off coupon):</div>
                      <input 
                        type="email" 
                        placeholder="you@email.com" 
                        value={formData.supporterEmail || ''}
                        onChange={(e) => setField('supporterEmail', e.target.value)}
                        style={{ width: '100%', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>UPI Transaction ID / UTR:</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="e.g. 423190812345" 
                          value={formData.upiTxnId || ''}
                          onChange={(e) => setField('upiTxnId', e.target.value)}
                          style={{ flex: 1, fontSize: '0.85rem' }}
                        />
                        <div style={{ 
                          padding: '10px 16px', 
                          background: 'var(--accent-soft)',
                          border: '1px solid var(--accent)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--accent-text)',
                          fontWeight: '600',
                          fontSize: '0.82rem',
                          cursor: formData.upiTxnId && formData.supporterEmail ? 'pointer' : 'not-allowed',
                          opacity: formData.upiTxnId && formData.supporterEmail ? 1 : 0.4,
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}
                          onClick={() => {
                            if (formData.upiTxnId && formData.supporterEmail) {
                              setPaymentDone(true);
                              setField('supporterTier', 'Early Supporter \u2014 \u20b9100');
                            }
                          }}
                        >
                          Confirm \u2713
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      default:
        return (
          <input 
            type={q.type} 
            name={q.id} 
            value={formData[q.id] || ''} 
            onChange={handleTextChange}
            placeholder={q.placeholder || ''}
          />
        );
    }
  };

  return (
    <div className="App">
      <div className="survey-header">
        <span className="logo-icon">✦</span>
        <h1>User Interview Survey</h1>
        <div className="step-indicator">
          Step {step + 1} of {sections.length}
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((step + 1) / sections.length) * 100}%` }}
        ></div>
      </div>
      
      {submitted ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✦</div>
          <h2 style={{ borderBottom: 'none', marginBottom: '8px', paddingBottom: '0' }}>Thank You!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
            Your responses have been recorded.
            {paymentDone && <><br/>You're an Early Supporter — we'll reach out with your 50% off tax filing benefit.</>}
            {formData.waitlistJoined && !paymentDone && <><br/>You're on the waitlist — we'll notify you at launch.</>}
          </p>
          {formData.phone && (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              We'll reach you at +91 {formData.phone}
            </div>
          )}
        </div>
      ) : currentSection && (
        <div className="card">
          <h2>{currentSection.title}</h2>
          <div className="form-content">
            {currentSection.questions.map(q => (
              <div key={q.id} className="input-group">
                {q.label && <label>{q.label}</label>}
                {renderInput(q)}
              </div>
            ))}
          </div>
          
          <div className="navigation-buttons">
            <button onClick={prevStep} disabled={step === 0}>← Back</button>
            <button onClick={handleNext} className="primary-btn">{isLastStep ? 'Submit ✓' : 'Continue →'}</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
