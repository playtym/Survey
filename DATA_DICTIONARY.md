# Survey Data Dictionary

This document outlines all the data fields collected by the survey application and how they map to the underlying data structure. This can be used to set up the Airtable columns or build a dashboard.

## Core Fields (Metadata)
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `sessionId` | String | Unique identifier for the user session (persisted across reloads) |
| `resp_status` | String | Status of response: `partial`, `abandoned`, or `complete` |
| `step` | Number | The last completed step number (0-indexed) |
| `timestamp` | DateTime | ISO string of when the data was last saved |

## Survey Fields (By Section)

### 1. About You
| Field ID | Airtable Column | Type | Options / Description |
| :--- | :--- | :--- | :--- |
| `name` | `name_resp` | Text | Full name of the respondent |
| `age` | | Single Select | 18-24, 25-34, 35-44, 45-54, 55+ |
| `place` | | Single Select + Text | City (Bangalore, Mumbai, etc.) or custom input |
| `place_other` | | Text | Custom city input |
| `profession` | | Single Select + Text | Salaried, Founder, Business Owner, etc. |
| `profession_other` | | Text | Custom profession input |
| `salary` | | Single Select | &lt; 10 LPA, 10-30 LPA, ... &gt; 2 Cr |
| `married` | | Single Select | Single, Married |
| `dependents` | | Multi Select | Parents, Siblings, No one (If Single) |

### 2. Family & Household (If Married)
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `workingSpouse` | Single Select | Yes, No |
| `householdIncome` | Single Select | &lt; 20 LPA ... &gt; 5 Cr (If spouse works) |
| `kids` | Number | Count of children |
| `dependents` | Multi Select | Parents, In-laws, Siblings, No one else |
| `jointAccount` | Multi Select | Yes - with Spouse, Yes - with Parents, No |
| `whyNoJoint` | Text | Reason for separate finances (If jointAccount='No') |
| `whyNoJoint_other` | Text | Custom reason for no joint account |
| `financialDecisionMaker` | Single Select | I do, Spouse does, We both do, Parents |

### 3. Money Mindset & Goals
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `moneyPersonality` | Single Select | Saver, Investor, Spender, Anxious, Set it & forget it |
| `financialLiteracy` | Single Select | 1-5 Scale |
| `financialGoals` | Multi Select + Text | Retirement, Home, Kids Ed, FIRE, etc. |
| `financialGoals_other` | Text | Custom goal input |
| `emergencyFund` | Single Select | Yes (various durations), No |
| `whyNoEmergencyFund` | Text | Reason for no fund (If has kids) |
| `whyNoEmergencyFund_other` | Text | Custom reason for no emergency fund |
| `salarySplitInvest` | Single Select | % of income to investments |
| `salarySplitEMI` | Single Select | % of income to EMIs |
| `highEMIReason` | Multi Select + Text | Home Loan, Car Loan, etc. (If EMI > 40%) |
| `highEMIReason_other` | Text | Custom loan type |
| `whyLowInvest` | Text | Reason for low investment (If high income) |
| `whyLowInvest_other` | Text | Custom reason for low investment |
| `investmentStyle` | Single Select | SIPs, Lumpsum, Mix, Don't invest |
| `biggestMoneyMistake` | Multi Select + Text | Not starting early, Wrong investment, etc. |
| `biggestMoneyMistake_other` | Text | Custom mistake |

### 4. Banking & Payments
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `bankAc` | Multi Select + Text | HDFC, SBI, ICICI, etc. |
| `bankAc_other` | Text | Custom bank name |
| `bankMultiReason` | Multi Select + Text | Reason for multiple accounts |
| `bankMultiReason_other` | Text | Custom reason |
| `cashInSavings` | Single Select | Amount scale (&lt; 1L to &gt; 25L) |
| `cashReason` | Text | Reason for high cash balance |
| `cashReason_other` | Text | Custom reason for high cash balance |
| `paymentModes` | Multi Select | UPI, CC, DC, Netbanking, Cash |
| `autoPay` | Single Select | Yes - all, Some, No |
| `autoPayReason` | Text | Reason for manual pay |
| `autoPayReason_other` | Text | Custom reason for manual pay |
| `autoPayPartialReason` | Text | Reason for partial auto-pay |
| `autoPayPartialReason_other` | Text | Custom reason for partial auto-pay |
| `highIncomeNoAutoPay` | Text | Deep dive on manual pay for high earners |
| `highIncomeNoAutoPay_other` | Text | Custom reason for manual pay (high income) |

### 5. Credit Cards
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `ccCount` | Number | Number of cards held |
| `ccNames` | Multi Select + Text | Specific card names (HDFC Infinia, etc.) |
| `ccNames_other` | Text | Custom card name |
| `ccBillPay` | Single Select | Payment behavior (Full, Minimum, Revolve) |
| `whyRevolve` | Text | Reason for revolving credit |
| `whyRevolve_other` | Text | Custom reason for revolving credit |
| `ccOptimisation` | Single Select | Yes/No on rewards |
| `ccResearch` | Multi Select + Text | How new cards are picked |
| `ccResearch_other` | Text | Custom research source |

### 6. Loans & Debt
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `activeLoans` | Multi Select | Home, Car, Education, Personal, Gold, None |
| `homeLoanOutstanding` | Single Select | Amount scale |
| `homeLoanRate` | Single Select | Interest rate bucket |
| `whyUnsureLoanRate` | Text | Reason for not knowing rate |
| `whyUnsureLoanRate_other` | Text | Custom reason for not knowing rate |
| `homeLoanReview` | Single Select | Refinancing history |
| `personalLoanReason` | Text | Reason for taking PL |
| `personalLoanReason_other` | Text | Custom reason for personal loan |
| `personalLoanRate` | Single Select | Interest rate bucket |
| `debtFreeReason` | Text | Reason for being debt-free |
| `debtFreeReason_other` | Text | Custom reason for being debt-free |
| `emiTracking` | Text | Method of tracking EMIs |
| `emiTracking_other` | Text | Custom EMI tracking method |
| `emiPrepayment` | Single Select | Prepayment behavior |

### 7. Portfolio Allocation

| Field ID | Type | Description |
| :--- | :--- | :--- |
| `investments` | Text (comma-separated) | Array of asset classes with non-zero allocation, e.g. "Mutual Funds, Stocks, Gold" |

**Note:** The individual % splits are mapped from `investments_<AssetClass>` in the app.

| App Field | Airtable Column | Description |
| :--- | :--- | :--- |
| `investments_Fixed Deposits` | `portfolioSplit_FD` | % Allocation (0-100) |
| `investments_Mutual Funds` | `portfolioSplit_MF` | % Allocation (0-100) |
| `investments_Stocks` | `portfolioSplit_Stocks` | % Allocation (0-100) |
| `investments_PMS / AIF` | `portfolioSplit_PMS` | % Allocation (0-100) |
| `investments_Real Estate` | `portfolioSplit_RE` | % Allocation (0-100) |
| `investments_Crypto` | `portfolioSplit_Crypto` | % Allocation (0-100) |
| `investments_Gold` | `portfolioSplit_Gold` | % Allocation (0-100) |
| `investments_Other` | `portfolioSplit_Other` | % Allocation (0-100) |
| `investments_Other_Text` | `portfolioSplit_Other_Text` | Description of 'Other' asset |

**Additional Portfolio Fields:**
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `portfolioDecision` | Text | How split was decided |
| `portfolioDecision_other` | Text | Custom portfolio decision reason |
| `portfolioReviewFreq` | Single Select | Review frequency |
| `whyNeverReview` | Text | Reason for never reviewing |
| `whyNeverReview_other` | Text | Custom reason for never reviewing |

### 8. Fixed Deposits (Deep Dive)
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `fdWhere` | Multi Select + Text | Banks, Post Office, etc. |
| `fdWhere_other` | Text | Custom FD location |
| `fdInterest` | Single Select | Rate bucket |
| `reasonForFD` | Multi Select + Text | Safety, Liquidity, etc. |
| `reasonForFD_other` | Text | Custom reason |
| `fdReview` | Single Select | Review frequency |
| `whyHeavyFD` | Single Select | Reason for high FD allocation (Youth) |

### 9. Mutual Funds (Deep Dive)
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `mfPlatform` | Multi Select + Text | Zerodha, Groww, etc. |
| `mfPlatform_other` | Text | Custom platform |
| `mfMultiReason` | Multi Select + Text | Reason for multiple platforms |
| `mfMultiReason_other` | Text | Custom reason |
| `mfType` | Multi Select + Text | Large Cap, Mid Cap, Index, etc. |
| `mfType_other` | Text | Custom type |
| `sip_percent` | Single Select | SIP as % of income |
| `whyNoSIP` | Text | Reason for no SIP |
| `whyNoSIP_other` | Text | Custom reason for no SIP |
| `noOfSIPs` | Number | Count of active SIPs |
| `mfDecision` | Multi Select + Text | Selection criteria |
| `mfDecision_other` | Text | Custom criteria |
| `regularVsDirect` | Single Select | Plan type awareness |
| `trackXIRR` | Single Select | Return tracking habit |
| `mfRebalancing` | Single Select | Rebalancing frequency |
| `whyNoRebalance` | Text | Reason for no rebalancing |
| `whyNoRebalance_other` | Text | Custom reason for no rebalancing |

### 10. Stocks (Deep Dive)
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `stocksPlatform` | Multi Select + Text | Zerodha, Groww, etc. |
| `stocksPlatform_other` | Text | Custom platform |
| `stockMultiReason` | Multi Select + Text | Reason for multiple brokers |
| `stockMultiReason_other` | Text | Custom reason |
| `stockFreq` | Single Select | Trading frequency |
| `stockDecision` | Multi Select + Text | Selection criteria |
| `stockDecision_other` | Text | Custom criteria |
| `tipsDamage` | Single Select | Experience with tips |
| `stockHowMuch` | Text | Position sizing logic |
| `stockHowMuch_other` | Text | Custom position sizing answer |
| `stockTrack` | Text | Tracking method |
| `stockTrack_other` | Text | Custom tracking method |
| `watchlist` | Single Select | Yes/No |

### 11. PMS / AIF (Deep Dive)
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `pmsType` | Multi Select | Discretionary, Non-Disc, AIF Cat 1-3 |
| `pmsDecision` | Text | Selection criteria |
| `pmsDecision_other` | Text | Custom PMS selection criteria |
| `pmsReturn` | Text | Return vs Expectation |
| `pmsFees` | Single Select | Fee model |
| `pmsSatisfaction` | Single Select | Satisfaction level |
| `whyStillPMS` | Text | Reason for staying if dissatisfied |
| `whyStillPMS_other` | Text | Custom reason for staying with PMS |
| `reasonNoPMS` | Text | Why not using PMS (High Income group) |
| `reasonNoPMS_other` | Text | Custom reason for not using PMS |

### 12. Real Estate (Deep Dive)
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `reType` | Multi Select | Home, Land, Commercial, etc. |
| `reDecision` | Text | Investment rationale |
| `reDecision_other` | Text | Custom real estate rationale |
| `reReview` | Single Select | Valuation review frequency |

### 13. Crypto (Deep Dive)
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `cryptoPlatform` | Multi Select + Text | WazirX, Binance, etc. |
| `cryptoPlatform_other` | Text | Custom platform |
| `cryptoType` | Multi Select + Text | BTC, ETH, Altcoins, etc. |
| `cryptoType_other` | Text | Custom asset |
| `cryptoDecision` | Text | Buying rationale |
| `cryptoDecision_other` | Text | Custom crypto buying rationale |
| `cryptoTaxAware` | Single Select | Tax awareness |
| `cryptoReview` | Single Select | Check frequency |

### 14. Gold (Deep Dive)
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `goldType` | Multi Select | Physical, SGB, ETF, Digital |
| `goldDecision` | Text | Rationale |
| `goldDecision_other` | Text | Custom gold rationale |
| `goldReview` | Single Select | Review frequency |

### 15. Insurance
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `insuranceTypes` | Multi Select | Life, Health, Vehicle, Home, None |
| `whyNoInsurance` | Text | Reason for none |
| `whyNoInsurance_other` | Text | Custom reason for no insurance |
| `whyNoHealth` | Text | Reason for no health |
| `whyNoHealth_other` | Text | Custom reason for no health ins |
| `insuranceDiscovery` | Multi Select + Text | Agent, PolicyBazaar, etc. |
| `insuranceDiscovery_other` | Text | Custom source |
| `insuranceAdequacy` | Single Select | Self-assessment of cover |
| `whyUnderInsured` | Text | Reason for under-insurance |
| `whyUnderInsured_other` | Text | Custom reason for under-insurance |
| `whyUnsureInsurance` | Text | Reason for uncertainty |
| `whyUnsureInsurance_other` | Text | Custom reason for insurance uncertainty |

### 16. Taxes
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `taxRegime` | Single Select | Old, New, Not sure |
| `whyUnsureRegime` | Text | Reason for uncertainty |
| `whyUnsureRegime_other` | Text | Custom reason for regime uncertainty |
| `taxFiling` | Text | Method (Self, CA, Portal) |
| `taxFiling_other` | Text | Custom tax filing method |
| `taxFilingFee` | Text | Fee paid (if CA/Portal) |
| `taxFilingFee_other` | Text | Custom filing fee |
| `caProactive` | Single Select | CA proactivity |
| `whyKeepCA` | Text | Reason for keeping reactive CA |
| `whyKeepCA_other` | Text | Custom reason for keeping CA |
| `taxOptimization` | Single Select | Optimization level |
| `taxHarvesting` | Single Select | Tax Loss Harvesting awareness |
| `taxSatisfaction` | Single Select | Satisfaction level |

### 17. Product & Automation
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `aggregatorOpenness` | Single Select | Account Aggregator willingness |
| `emailShare` | Single Select | Email access willingness |
| `whyNoDataShare` | Text | Privacy concerns |
| `whyNoDataShare_other` | Text | Custom privacy concern |
| `willingToPayTax` | Single Select | WTP for automation |
| `painPoints` | Multi Select + Text | Biggest financial pains |
| `painPoints_other` | Text | Custom pain point |
| `singleView` | Single Select | Dashboard interest |
| `whyNoDashboard` | Text | Dashboard skepticism |
| `whyNoDashboard_other` | Text | Custom dashboard concern |
| `oneButtonPay` | Single Select | Bill pay automation interest |
| `autoInvest` | Single Select | Auto-invest interest |
| `autoRebalance` | Single Select | Auto-rebalance interest |
| `aiAdvisor` | Single Select | AI advisor interest |

### 18. Closing & Waitlist
| Field ID | Type | Options / Description |
| :--- | :--- | :--- |
| `criticalFeatures` | Multi Select + Text | Must-have features |
| `criticalFeatures_other` | Text | Custom feature |
| `dataPrivacy` | Single Select | Comfort with sharing data |
| `interactionPreference` | Single Select | App, Web, WhatsApp, Email |
| `advisoryStyle` | Single Select | AI vs Human |
| `viewOnProduct` | Single Select | Overall interest |
| `willingnessToPay` | Single Select | Annual subscription WTP |
| `userSuggestions` | Text (Long) | Open feedback |
| `email` | Text | Waitlist Email |
| `phone` | Text | Waitlist Phone |
| `waitlistJoined` | Boolean | True if joined |
| `supporterEmail` | Text | Email for payment confirmation |
| `upiTxnId` | Text | UPI Transaction ID |
| `supporterTier` | Text | "Early Supporter — ₹100" |
