param(
    [Parameter(Mandatory=$true)]
    [string]$TargetUrl
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is required to run ZAP baseline."
    exit 1
}

Write-Host "Running OWASP ZAP baseline scan against $TargetUrl"

docker run --rm -t owasp/zap2docker-stable zap-baseline.py `
    -t $TargetUrl `
    -r zap_baseline_report.html

Write-Host "Report generated: zap_baseline_report.html"
