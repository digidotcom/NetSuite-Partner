Features
- Filter images by n options, no just one as the references does.
- Show the selected child on the cart and mini cart.
- Show the item images on the facet browse filtered by the selection of the customer.
- Order the thumbnails by naming convention
- Use different item options to filter images per different items.
- Show only main images to avoid a lot of images on the pdp



Configuration file
multiImageOption: ['custcol_color','custcol_size','custcol_weight'],
showOnlyMainImages: true


We need to create an array of the options that we are going to use to filter the images, this is very important because the naming convention depends of this configuration.
This option will be matched with the product options to only use the ones that the actual item actually has.

E.g.:
One item has only color and size, the code will only use 'custcol_color' and 'custcol_size' to find the child image, on the array order COLOR|SIZE
Another item has only color and weight, the code will only use 'custcol_color' and 'custcol_weight' to find the child image, on that order COLOR|WEIGHT
The code will take the first option ( available on the item ) as primary and if you don't have all the combinations will show the primary images and the rest of the all options.


Naming convention for images.
We need to name the  images correctly to use this functionality, on the option part of the  image name we need to separate the options with a |
The url component is the most common field to name the images of the products, so let's take this item url as an example 'Multi-Image-Example'.
The images needs to be named as flowing:

Multi-Image-Example_Main-1.jpg
Multi-Image-Example_Red|Small-2.jpg
Multi-Image-Example_Red|Medium-3.jpg
Multi-Image-Example_Red|Large-4.jpg
Multi-Image-Example_Blue|Small-5.jpg
Multi-Image-Example_Blue|Medium-6.jpg
Multi-Image-Example_Blue|Large-7.jpg
So if we select 'Red' as an option the code will return this images:

Multi-Image-Example_Red|Small-2.jpg
Multi-Image-Example_Red|Medium-3.jpg
Multi-Image-Example_Red|Large-4.jpg
If we select 'Small' as option will return:

Multi-Image-Example_Red|Small-2.jpg
Multi-Image-Example_Blue|Small-5.jpg
And if will select both options ( Red and Small ) we only get this image "Multi-Image-Example_Red|Small-2.jpg"



Child image on cart
The color swatch works automatically like in the pdp.
If you go to the cart it will show the image of that swatch if the image exists.


Order images
The other option is for the order of the images for the items.
right now if you have swatches you can’t order the images by number, it’s order by swatch name.

Without the customization the images order will be White,Black,Alloys and Navy
With the customization will be Alloy-1, Alloy-2, White-3, Black-4, Alloy-5, Navy-6
The customization takes the last number ( -NUMBER ) and orders the images asc, if an image don’t have number, it will be shown at the end.