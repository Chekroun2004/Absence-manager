param (
    [string]$Root = (Get-Location).Path
)

function Show-Tree($path, $prefix = "") {
    $items = Get-ChildItem $path |
        Where-Object { $_.Name -notin @(".git", "node_modules") }

    $count = $items.Count
    $index = 0

    foreach ($item in $items) {
        $index++
        $connector = if ($index -eq $count) { "+-- " } else { "|-- " }
        $line = "$prefix$connector$($item.Name)"

        $line | Out-File arborescence.txt -Append -Encoding UTF8

        if ($item.PSIsContainer) {
            $newPrefix = if ($index -eq $count) {
                "$prefix    "
            } else {
                "$prefix|   "
            }
            Show-Tree $item.FullName $newPrefix
        }
    }
}

Remove-Item arborescence.txt -ErrorAction SilentlyContinue
Show-Tree $Root