# daily-insights-square-api

</br>
</br>
<div align="center">
    <img width="200" height="200" alt="Screenshot 2024-08-03 at 23 26 26" src="https://github.com/user-attachments/assets/3c7c7fdf-d763-4090-aaab-07d67113cf3b">
</div>
</br>
</br>
Square provides comprehensive sales reporting insights. However, it does not offer customized insights for businesses with revenue that varies based on the day of the week. This project addresses that gap by providing business owners with detailed insights into current and historical sales for specific days. Additionally, it sends daily email reports to management.
</br>
This project uses [Google Apps Script](https://www.google.com/script/start/) for code execution. Additionally, it leverages various GSuite APIs, including Gmail (_sending daily insight email_), Sheets (_constructing graphs for daily insight email_), and PropertyService (_storing sensitive data_). The project also relies on the Square API to retrieve crucial data for historical and daily sales, labor, and other key metrics.
</br>
</br>

<div align="center">
<img width="600" src="https://github.com/user-attachments/assets/e01f3690-dfcc-421b-af7a-48d5184618cc">
</div>

</br>
</br>

1. Get started with Google App Script: 

```
clasp login # follow browser prompts to login

# Do this at the start if you made changes in the browser IDE.
clasp pull

# Do this to save
clasp push
```

</br>
</br>
2. Add script properties
<div align="center">
<img width="600" src="https://github.com/user-attachments/assets/959d967c-d199-49cb-8ef5-48a185f8ff2f">
</div>
</br>
</br>
3. Configure the trigger and choose a time to receive the insights email
<div align="center">
<img width="600" src="https://github.com/user-attachments/assets/ec77bd74-b744-4220-9787-5c6517374f25">
</div>

