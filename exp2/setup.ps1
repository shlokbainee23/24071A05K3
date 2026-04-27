# =============================================================================
# ClickKart - exp2 one-shot setup script
# Project : ClickKart Shopping Portal
# Roll No : 24071A05K3
#
# What this does (no Maven required):
#   1. Downloads Apache Tomcat 10.1.54 (zip) into .\tomcat
#   2. Downloads jakarta.servlet-api-6.0.0.jar
#   3. Compiles src\main\java\com\clickkart\*.java with javac
#   4. Packages everything into target\exp2.war
#   5. Copies WAR to .\tomcat\webapps
#   6. Starts Tomcat in a new window
#
# Run from the exp2 folder:
#   PS> .\setup.ps1
#
# Stop Tomcat with:  .\stop.ps1
# =============================================================================

$ErrorActionPreference = 'Stop'

$Root        = $PSScriptRoot
$TomcatVer   = '10.1.54'
$TomcatDir   = Join-Path $Root "tomcat"
$TomcatHome  = Join-Path $TomcatDir "apache-tomcat-$TomcatVer"
$LibDir      = Join-Path $Root "WebContent\WEB-INF\lib"
$BuildDir    = Join-Path $Root "build\classes"
$TargetDir   = Join-Path $Root "target"
$WarStage    = Join-Path $Root "build\war"
$ServletJar  = Join-Path $LibDir "jakarta.servlet-api-6.0.0.jar"
$WarFile     = Join-Path $TargetDir "exp2.war"

function Write-Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Cyan
}

# -----------------------------------------------------------------------------
# 0. Sanity: Java present?
# -----------------------------------------------------------------------------
Write-Step "Locating a full JDK (need javac + jar)"
function Find-Jdk {
    $candidates = @()
    if ($env:JAVA_HOME) { $candidates += $env:JAVA_HOME }
    foreach ($base in @(
        "C:\Program Files\Java",
        "C:\Program Files\Eclipse Adoptium",
        "C:\Program Files\Microsoft",
        "C:\Program Files\Amazon Corretto",
        "C:\Program Files\Zulu"
    )) {
        if (Test-Path $base) {
            Get-ChildItem $base -Directory -ErrorAction SilentlyContinue |
                Where-Object { Test-Path (Join-Path $_.FullName "bin\jar.exe") } |
                ForEach-Object { $candidates += $_.FullName }
        }
    }
    foreach ($jdkPath in ($candidates | Select-Object -Unique)) {
        if ((Test-Path (Join-Path $jdkPath "bin\javac.exe")) -and
            (Test-Path (Join-Path $jdkPath "bin\jar.exe"))) {
            return $jdkPath
        }
    }
    return $null
}

$JdkHome = Find-Jdk
if (-not $JdkHome) {
    Write-Error "Could not find a full JDK with javac + jar. Install JDK 17+ from https://adoptium.net"
    exit 1
}
$JavaBin = Join-Path $JdkHome "bin"
$JavaExe  = Join-Path $JavaBin "java.exe"
$JavacExe = Join-Path $JavaBin "javac.exe"
$JarExe   = Join-Path $JavaBin "jar.exe"
$env:JAVA_HOME = $JdkHome
$env:Path = "$JavaBin;$env:Path"
Write-Host "JAVA_HOME = $JdkHome"

# -----------------------------------------------------------------------------
# 1. Download Tomcat
# -----------------------------------------------------------------------------
if (-not (Test-Path $TomcatHome)) {
    Write-Step "Downloading Apache Tomcat $TomcatVer"
    New-Item -ItemType Directory -Force -Path $TomcatDir | Out-Null
    $zipUrl  = "https://dlcdn.apache.org/tomcat/tomcat-10/v$TomcatVer/bin/apache-tomcat-$TomcatVer.zip"
    $zipPath = Join-Path $TomcatDir "tomcat.zip"
    Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
    Write-Host "Extracting..."
    Expand-Archive -Path $zipPath -DestinationPath $TomcatDir -Force
    Remove-Item $zipPath
} else {
    Write-Step "Tomcat already installed at $TomcatHome"
}

# -----------------------------------------------------------------------------
# 2. Download Jakarta Servlet API
# -----------------------------------------------------------------------------
if (-not (Test-Path $ServletJar)) {
    Write-Step "Downloading jakarta.servlet-api-6.0.0.jar"
    New-Item -ItemType Directory -Force -Path $LibDir | Out-Null
    $jarUrl = "https://repo1.maven.org/maven2/jakarta/servlet/jakarta.servlet-api/6.0.0/jakarta.servlet-api-6.0.0.jar"
    Invoke-WebRequest -Uri $jarUrl -OutFile $ServletJar -UseBasicParsing
} else {
    Write-Step "Servlet API jar already present"
}

# -----------------------------------------------------------------------------
# 3. Compile Java sources
# -----------------------------------------------------------------------------
Write-Step "Compiling Java sources with javac"
if (Test-Path $BuildDir) { Remove-Item -Recurse -Force $BuildDir }
New-Item -ItemType Directory -Force -Path $BuildDir | Out-Null

$Sources = Get-ChildItem -Recurse -Filter *.java "$Root\src\main\java" | ForEach-Object { $_.FullName }
& $JavacExe --release 17 -cp "$ServletJar" -d "$BuildDir" $Sources
if ($LASTEXITCODE -ne 0) {
    Write-Error "javac failed"
    exit 1
}

# -----------------------------------------------------------------------------
# 4. Stage WAR layout
# -----------------------------------------------------------------------------
Write-Step "Staging WAR layout"
if (Test-Path $WarStage) { Remove-Item -Recurse -Force $WarStage }
New-Item -ItemType Directory -Force -Path "$WarStage\WEB-INF\classes" | Out-Null

# Copy compiled classes
Copy-Item -Recurse -Force "$BuildDir\*" "$WarStage\WEB-INF\classes\"

# Copy WebContent (web.xml etc.) but skip the lib folder - servlet API is
# 'provided' by Tomcat and must NOT be inside the WAR.
Copy-Item -Recurse -Force "$Root\WebContent\*" "$WarStage\"
$warLib = Join-Path $WarStage "WEB-INF\lib"
if (Test-Path $warLib) {
    Get-ChildItem $warLib -Filter "jakarta.servlet-api*.jar" -ErrorAction SilentlyContinue | Remove-Item -Force
    Get-ChildItem $warLib -Filter "*.gitkeep" -ErrorAction SilentlyContinue | Remove-Item -Force
}

# -----------------------------------------------------------------------------
# 5. Build WAR
# -----------------------------------------------------------------------------
Write-Step "Building target\exp2.war"
New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null
if (Test-Path $WarFile) { Remove-Item $WarFile -Force }
Push-Location $WarStage
try {
    & $JarExe -cf $WarFile .
    if ($LASTEXITCODE -ne 0) { throw "jar failed" }
} finally {
    Pop-Location
}
Write-Host "Built: $WarFile"

# -----------------------------------------------------------------------------
# 6. Deploy to Tomcat
# -----------------------------------------------------------------------------
Write-Step "Deploying to Tomcat webapps"
$WebappsDir = Join-Path $TomcatHome "webapps"
$DeployedWar     = Join-Path $WebappsDir "exp2.war"
$DeployedExploded = Join-Path $WebappsDir "exp2"
if (Test-Path $DeployedWar)      { Remove-Item $DeployedWar -Force }
if (Test-Path $DeployedExploded) { Remove-Item -Recurse -Force $DeployedExploded }
Copy-Item $WarFile $DeployedWar -Force
Write-Host "Deployed to $DeployedWar"

# -----------------------------------------------------------------------------
# 7. Start Tomcat (new window so logs are visible and this script returns)
# -----------------------------------------------------------------------------
Write-Step "Starting Tomcat"
$env:CATALINA_HOME = $TomcatHome
$startBat = Join-Path $TomcatHome "bin\catalina.bat"

# Kill any old Tomcat first (anything bound to 8080)
$oldPids = (Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue).OwningProcess | Sort-Object -Unique
foreach ($oldPid in $oldPids) {
    try {
        Write-Host "Killing process $oldPid on port 8080..."
        Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue
    } catch {}
}

Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "`"$startBat`" run" -WorkingDirectory (Join-Path $TomcatHome "bin")

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " Tomcat starting in a new window (CATALINA_HOME=$TomcatHome)" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Wait ~5 seconds, then open:"                                 -ForegroundColor Yellow
Write-Host "  http://localhost:8080/exp2/discount?purchaseAmount=3500"   -ForegroundColor Yellow
Write-Host ""
Write-Host "Stop Tomcat with: .\stop.ps1"                                -ForegroundColor Yellow
