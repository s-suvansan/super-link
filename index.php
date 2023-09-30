<?php
// Your dynamic data or logic to determine the meta tag values
$title = "New Page Title";
$description = "This is a new description";
$image = "https://cdn.pixabay.com/photo/2023/08/26/14/19/cupcake-8215179_1280.jpg";

// HTML content with placeholders for meta tags
$html = '
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>%TITLE%</title>
    <meta name="description" content="%DESCRIPTION%" />
    <meta property="og:title" content="%TITLE%">
    <meta property="og:description" content="%DESCRIPTION%">
    <meta property="og:image" content="%IMAGE%">
  </head>
  <body>
    <!-- Your page content here -->
  </body>
</html>
'; 
// Replace placeholders with dynamic values 
$html = str_replace('%TITLE%',$title, $html); 
$html = str_replace('%DESCRIPTION%', $description, $html); 
$html = str_replace('%IMAGE%', $image, $html); // Output the modified HTML to the browser 

echo $html; 
?>
 