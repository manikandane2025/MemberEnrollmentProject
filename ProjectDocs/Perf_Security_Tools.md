# Performance and Security Tooling

## Selected Tools
- Performance: k6
- Security: OWASP ZAP (baseline scan)

## Why these tools
- k6 is lightweight, scriptable, and demo-friendly.
- ZAP baseline is fast, repeatable, and produces clear reports.

## Demo Usage (Typical)
### Performance (k6)
```
k6 run ProjectDocs/Perf_Security_Templates/k6_smoke.js
```

### Security (ZAP baseline)
```
ProjectDocs/Perf_Security_Templates/zap_baseline.ps1 -TargetUrl http://localhost:3002
```

## Notes
- Update target URLs based on the sprint environment.
- Keep scripts lightweight for live demos.
