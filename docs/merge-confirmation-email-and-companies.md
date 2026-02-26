# Email & company merge confirmation list

Use this list to confirm which accounts should be merged: **primary** (one account per org) and **secondary** (linked as team members under the primary). Data/surveys for secondaries should be associated with the primary company.

**Source:** Pasted spreadsheet data. No Excel file was in the repo — if you have an Excel file, compare against it and correct any row below.

**Data model:** Primary = `user_profiles` row (and auth user) that represents the company. Secondaries = linked via `company_members` (member_user_id → primary’s company_user_id). Surveys/data can be reassigned to the primary.

---

## 1. ATG Samata
| Role      | Email                | Notes |
|-----------|----------------------|--------|
| **Primary**   | Lisa@atgsamata.com        | Keep as main account. |
| Secondary | lelemba@atgsamata.com     | Link to primary (Notes: "Change secondary to: lelemba@atgsamata.com"). |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 2. Atlantica Ventures
| Role      | Email                        |
|-----------|------------------------------|
| **Primary**   | aniko@atlanticaventures.com      |
| Secondary | ik@atlanticaventures.com        |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 3. Anza Capital
| Role      | Email                            | Notes |
|-----------|----------------------------------|--------|
| **Primary**   | Audrey@anza.holdings                 | "Need to be merged as one org - Anza Capital". |
| Secondary | innocent@anzaentrepreneurs.co.tz     | Merge into primary. |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 4. Aruwa Capital Management
| Role      | Email                   |
|-----------|-------------------------|
| **Primary**   | aor@aruwacapital.com        |
| Secondary | bu@aruwacapital.com        |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 5. Balloon Ventures
| Role      | Email                   | Notes |
|-----------|-------------------------|--------|
| **Primary**   | josh@balloonventures.com   | "Need to be merged as one org". Two rows in source with same email (balloon ventures / Balloon Ventures) — treat as one primary. |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Duplicate row resolved / data merged  

---

## 6. Brightmore Capital
| Role      | Email                                  | Notes |
|-----------|----------------------------------------|--------|
| **Primary**   | ndeye.thiaw@brightmorecapital.com          | "Remove or merge duplicate email?" (Ndeye.thiaw vs ndeye.thiaw — same person). |
| Secondary | dmitry.fotiyev@brightmorecapital.com      | Link to primary. |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 7. Comoé Capital
| Role      | Email                     |
|-----------|---------------------------|
| **Primary**   | d.doumbia@comoecapital.com   |
| Secondary | i.sidibe@comoecapital.com   |
| Secondary | a.fofana@comoecapital.com   |

*Source had "ComoÃ© Capital" and "COMOE CAPITAL" — normalize to one company name.*

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 8. First Circle Capital
| Role      | Email                        |
|-----------|------------------------------|
| **Primary**   | selma@firstcircle.capital        |
| Secondary | agnes@firstcircle.capital       |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 9. Haba Capital
| Role      | Email                        |
|-----------|------------------------------|
| **Primary**   | teddy.onserio@habacapital.com   |
| Secondary | finance@habacapital.com         |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 10. HEVA Fund
| Role      | Email                 |
|-----------|-----------------------|
| **Primary**   | Wakiuru@hevafund.com     |
| Secondary | kendi@hevafund.com      |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 11. i2i Ventures / Kapita
| Role      | Email                        | Notes |
|-----------|------------------------------|--------|
| **Primary**   | klakhani@Invest2innovate.com     | "Need to be merged as one org - i2i Ventures". Same email appears for "Kapita" — confirm if same org or two orgs. |

- [ ] Confirmed (one org or two?)  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 12. Impact Capital Advisors
| Role      | Email                        |
|-----------|------------------------------|
| **Primary**   | a.annan@impcapadv.com            |
| Secondary | annan.anthony@gmail.com          |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 13. Linea Capital Partners
| Role      | Email                            | Notes |
|-----------|----------------------------------|--------|
| **Primary**   | julia@lineacap.com                   | "Need to be merged as one org - Linea Capital Partners". |
| Secondary | julia@lineacap.compital.com          | *Typo in domain? Confirm.* |
| Secondary | colin@lineacap.com                   | |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 14. LoftyInc Capital Management / LoftyInc Capital
| Role      | Email                        | Notes |
|-----------|------------------------------|--------|
| **Primary**   | idris.bello@loftyincltd.biz     | "Need to be merged as one org - LoftyInc Capital Management". |
| Secondary | alyune@loftyinc.vc              | |
| Secondary | idris@loftyinc.vc               | |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 15. Miarakap
| Role      | Email                        |
|-----------|------------------------------|
| **Primary**   | e.cotsoyannis@miarakap.com       |
| Secondary | e.ravohitrarivo@miarakap.com     |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 16. Mirepa Investment Advisors / MIREPA Investment Advisors
| Role      | Email                        | Notes |
|-----------|------------------------------|--------|
| **Primary**   | enyonam@mirepaadvisors.com       | "Need to be merged as one org". Notes say enyonam@mirepaadvisors.com; source also has enyonam@mirepacapital.com. |
| Secondary | sam@mirepaadvisors.com          | |
| Secondary | enyonam@mirepacapital.com       | Same person, different domain — merge to primary. |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 17. PearlBridge Capital Managers / Pearl Capital Partners
| Role      | Email                                | Notes |
|-----------|--------------------------------------|--------|
| **Primary**   | funmiadepoju@gmail.com                    | "Need to be merged as one org - PearlBridge Capital Managers". |
| Secondary | david.wangolo@pearlcapital.net            | |
| Secondary | o.adepoju@pearlbridgecapital.africa       | |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 18. ReNew Capital / RENEW
| Role      | Email                    |
|-----------|--------------------------|
| **Primary**   | ldavis@renewcapital.com     |
| Secondary | ldavis@renewcapital.com     | *Same email twice in source — single primary, no other secondary.* |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Duplicate row removed  

---

## 19. SME Impact Fund
| Role      | Email                    |
|-----------|--------------------------|
| **Primary**   | allert@mmfm-ltd.com         |
| Secondary | anthony@mmfm-ltd.com        |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 20. Uberis
| Role      | Email                            |
|-----------|----------------------------------|
| **Primary**   | sov.leang@uberiscapital.com         |
| Secondary | william.prothais@uberiscapital.com  |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 21. Uncap / Ubuntu Kaizen Capital Partners
| Role      | Email                            | Notes |
|-----------|----------------------------------|--------|
| **Primary**   | franziska@unconventional.capital   | Uncap: Primary franziska. Notes also say "Ubuntu Kaizen Capital Partners" primary: franziska@unconventional.capital (Nkhulu@torhotech.com → primary franziska). |
| Secondary | esther@unconventional.capital       | |
| Secondary | Nkhulu@torhotech.com               | Ubuntu Kaizen — merge to Uncap primary? Confirm. |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 22. VestedWorld
| Role      | Email                    |
|-----------|--------------------------|
| **Primary**   | nneka@vestedworld.com      |
| Secondary | peter@vestedworld.com      |
| Secondary | lavanya@vestedworld.com    |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 23. ViKtoria Ventures
| Role      | Email                    |
|-----------|--------------------------|
| **Primary**   | stephengugu@viktoria.co.ke   |
| Secondary | wilfred@viktoria.co.ke      |
| Secondary | jason@viktoria.co.ke        |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 24. Villgro Africa
| Role      | Email                    |
|-----------|--------------------------|
| **Primary**   | wilfred@villgroafrica.org   |
| Secondary | stawia@gmail.com           |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 25. Wangara Green Ventures
| Role      | Email                        |
|-----------|------------------------------|
| **Primary**   | e.arthur@wangaracapital.com     |
| Secondary | k.owusu-sarfo@wangaracapital.com |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## 26. wCap Limited
| Role      | Email                    |
|-----------|--------------------------|
| **Primary**   | nyeji@womencapital.co      |
| Secondary | yvonne@womencapital.co.com | *Domain typo .co.com — confirm.* |

- [ ] Confirmed  
- [ ] Primary exists in DB  
- [ ] Secondaries linked / data moved  

---

## Other notes from spreadsheet

- **Graca Machel Trust** – Org name should be: **AfriShela** (AndiaC@gracamacheltrust.org).
- **BFA Asset Management** – Primary: rui.goncalves.oliveira@am.bfa.ao (bfaga.negocio@am.bfa.ao secondary?).
- **CURRENT NETWORK MEMBERS - NEED ACCOUNTS** block in the paste had a shorter list (e.g. Amplifica Capital, Atlantica Ventures, Climate Resilience Fund, etc.); those without explicit "Primary:" in the main table are listed in that block — confirm if any of those also need merge rules.

---

## How to use this list

1. **Compare with your Excel** and fix any primary/secondary or company name.
2. **Tick "Confirmed"** for each org once you’re happy with the primary and secondaries.
3. **Check DB:** For each row, confirm the primary email exists in `user_profiles` (and in auth).
4. **Execute merges:** Either run SQL/migrations to add `company_members` rows and reassign surveys to the primary, or use an admin tool/script that does the same. If you want, we can add a small script or Edge Function that takes this list and creates `company_members` + reassigns data for the primary.

If you share the Excel file (or paste a CSV), I can align this document to it and add a script to apply the merges.
