try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri 'https://my-project-jackson-furaha-s-projects.vercel.app'
    $content = $response.Content
    $len = if ($content.Length -gt 400) { 400 } else { $content.Length }
    $content.Substring(0, $len)
} catch {
    Write-Error $_.Exception.Message
}
