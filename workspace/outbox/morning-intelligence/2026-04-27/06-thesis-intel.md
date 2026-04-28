# Thesis Intel — 2026-04-27

## TL;DR
- Benchmarks are converging on “agent-grade” document parsing (treat extraction like software with tests).
- Voice/deepfake risk is becoming a core KYC/claims threat model (watermarking + step-up verification).
- Export-control policy keeps shaping compute cost/availability (plan infra resilience).

## Hallazgos
1) OCRBench v2 (multimodal OCR eval)
   - Link(s): https://99franklin.github.io/ocrbench_v2/
2) Omni benchmark repo (Document→OCR→Extraction evaluation)
   - Link(s): https://github.com/getomni-ai/benchmark
3) AudioMarkNet: audio watermarking for deepfake speech detection
   - Link(s): https://www.usenix.org/system/files/usenixsecurity25-zong.pdf
4) WEF deepfakes + digital identity verification report
   - Link(s): https://reports.weforum.org/docs/WEF_Unmasking_Cybercrime_Strengthening_Digital_Identity_Verification_against_Deepfakes_2026.pdf
5) Orange Business adds deepfake detection for enterprise comms
   - Link(s): https://www.orange-business.com/en/press/newsblog-Orange-business-adds-deepfake-detection-enterprise-communications
6) CRS: U.S. export controls and China (advanced semiconductors)
   - Link(s): https://www.congress.gov/crs_external_products/R/PDF/R48642/R48642.5.pdf

## Ideas para Brokia
- Doc Quality Gate (regression suite + scorecard)
- Voice Risk Control Pack (watermark check + escalation)
- Compute Resilience (2 backends)
