<#
  setup-supabase.ps1

  PowerShell helper to create a local `supabase-config.js` from the example.
  Usage (PowerShell):
    ./scripts/setup-supabase.ps1

  After running, open `supabase-config.js` in your editor and paste your real
  `SUPABASE_URL`, `SUPABASE_ANON_KEY` and (optionally) `SUPABASE_PUBLISHABLE_KEY`.
#>

$example = Join-Path -Path $PSScriptRoot -ChildPath '..\supabase-config.example.js'
$target  = Join-Path -Path $PSScriptRoot -ChildPath '..\supabase-config.js'

if (-Not (Test-Path $example)) {
    Write-Error "Example file not found: $example"
    exit 1
}

if (Test-Path $target) {
    Write-Host "A local supabase-config.js already exists at $target. Aborting to avoid overwrite."
    Write-Host "If you want to replace it, delete it first or run: Remove-Item $target"
    exit 0
}

Copy-Item -Path $example -Destination $target
Write-Host "Created local config: $target"
Write-Host "Open the file and replace placeholders with your Supabase project's URL and anon key."
Write-Host "Then run a local server (see README) and open signup/login pages to test."
