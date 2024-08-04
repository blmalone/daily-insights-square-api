# daily-insights-square-api

Square provides comprehensive sales reporting insights. However, it does not offer customized insights for businesses with revenue that varies based on the day of the week. This project addresses that gap by providing business owners with detailed insights into current and historical sales for specific days. Additionally, it sends daily email reports to management.

![Screenshot 2024-08-03 at 23 46 12](https://github.com/user-attachments/assets/e01f3690-dfcc-421b-af7a-48d5184618cc)

The project relies on [Google App Script](https://www.google.com/script/start/) for code execution. Additionally, this application makes use of various GSuite APIs including, Gmail, Sheet and PropertyService.

1. Get started with Google App Script: 
```
clasp login # follow browser prompts to login

# Do this at the start if you made changes in the browser IDE.
clasp pull

# Do this to save
clasp push
```


2. Add script properties
![Screenshot 2024-08-03 at 23 04 29-redacted_dot_app](https://github.com/user-attachments/assets/959d967c-d199-49cb-8ef5-48a185f8ff2f)

3. Configure the trigger and choose a time to receive the insights email
4. <img width="753" alt="Screenshot 2024-08-03 at 23 26 26" src="https://github.com/user-attachments/assets/ec77bd74-b744-4220-9787-5c6517374f25">


