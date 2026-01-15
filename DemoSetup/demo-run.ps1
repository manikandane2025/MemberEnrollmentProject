param(
    [Parameter(Mandatory=$false)]
    [string]$Ref = "",
    [Parameter(Mandatory=$false)]
    [string]$RepoPath = ".",
    [Parameter(Mandatory=$false)]
    [switch]$StartServers
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "git not found. Install git or run from a git-enabled shell."
    exit 1
}

Set-Location $RepoPath

if (-not (Test-Path ".git")) {
    Write-Host "No .git directory found in $RepoPath. Provide a valid repo path."
    exit 1
}

git status --porcelain | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "git status failed. Check repo integrity."
    exit 1
}

$dirty = git status --porcelain
if ($dirty) {
    Write-Host "Working tree is dirty. Commit or stash before switching refs."
    exit 1
}

if ($Ref -ne "") {
    $refExists = git show-ref --verify --quiet "refs/heads/$Ref"
    if ($LASTEXITCODE -ne 0) {
        $refExists = git show-ref --verify --quiet "refs/tags/$Ref"
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Ref '$Ref' not found. Use a sprint tag like sprint-01 or branch like sprint/S01."
        exit 1
    }

    git checkout $Ref
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to checkout $Ref."
        exit 1
    }
    Write-Host "Checked out $Ref."
} else {
    Write-Host "No ref provided. Skipping checkout."
}

Write-Host ""
if ($StartServers) {
    Write-Host "Starting backend and frontend in new terminals..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$RepoPath\\backend`"; python -m uvicorn app.main:app --reload --port 8000"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$RepoPath\\frontend`"; npm run dev"
    Write-Host "Servers launched."
} else {
    Write-Host "Next: start backend and frontend in separate terminals."
    Write-Host "Backend:  cd backend; python -m uvicorn app.main:app --reload --port 8000"
    Write-Host "Frontend: cd frontend; npm run dev"
    Write-Host "Tip: use -StartServers to auto-launch."
}
