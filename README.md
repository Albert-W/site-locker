# Site Locker

It's a super lightweight chrome extension to lock website and increase productivity.

In order to reduce the performance cost from this extension, I did not add any makeups nor jQuery. 


## Usage

![](Snipaste_2020-08-19_11-00-55.png)
1. Block the current website. 

![](Snipaste_2020-08-19_12-17-27.png)

2. Unblock all of them for certain minutes.

3. Watch the remain minutes through the badge. 

4. After the time eclipses, those blocked websites turn blocked again. 

5. Manage the blacklist through options page. 

![](Snipaste_2020-08-19_10-57-45.png)

6. Block a website through context menu.

![](Snipaste_2020-08-19_12-20-20.png)


## Architechture

1. manifest.json

    Describe the project, register resources, ask for permissions. 

2. popup.html + popup.js 

    Maintain the pop-up page and the click events. 
3. options.html + option.js 

    Maintain the option page and the click events. 
4. eventPage.js

    work in the background, keep the extension functional when the pop-up page is disappear.





