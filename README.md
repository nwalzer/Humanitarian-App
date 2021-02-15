# Humanitarian-App CS MQP

Proof of concept application.

Deployment can be found [here](https://humanitarian-app-development.web.app)

This web app utilizes a react frontend with a nodeJS and firebase backend. 

# Security Developments
- [Password hashing](#Password-Hashing)
- [JWT generation](#JWT-Generation)
- [Firebase authentication](#Firebase-Authentication)
- [Firebase security rules](#Firebase-Security-Rules)
- [Service account development](#Service-Account-Development)

## Password Hashing
In order to comply with general security recommendations, our user passwords are salted and hashed. We utilize the [bcrypt](https://www.npmjs.com/package/bcrypt) nodeJS module to handle password hashes and comparisons. There are several advantages to using the bcrypt module: 
- [Performance vs security can be altered as needed for hashing passwords](#Workload-Configurability)
- [Hashing and password comparisons can be performed asynchonously](#Asynchronous-Hashing)
- [Standardized hash formats](#Standardized-Format)
- [Widespread use](#Module-Popularity)

### Workload Configurability
When hashing a password, we use a default 2^12 iterations of processing, giving us a performance of 2-3 hashes/sec on a 2GHz core. By reducing the number of 'rounds' bcrypt utilizes (where x rounds = 2^x iterations) we can increase performance should we receive a high volume of user registrations. Similarly, should our firebase environment have a far greater performance than expected, or extra security is needed, we can exponentially increase the number of rounds to greatly increase the time it would take to generate hashes for our environment. Such configurability allows us to account for [Moore's Law](https://en.wikipedia.org/wiki/Moore%27s_law) and keep our hashes cryptographically secure. 

### Asynchronous Hashing
Though security is, obviously, a major concern, there is a limit to how secure something can be before the cost to performance (and subsequent loss of user traffic) outweighs the security benefit. This is why we use a default 12 rounds for password hashing, as 2-3 hashes/sec is more than enough for a small-scale prototype web app like ours. That being said, bcrypt offers a performance boost by having asynchronous capabilities. Since hashing and hash comparisons are CPU-intensive operations, a synchronous operation will block the server from performing other operations, including serving webpages to other clients. The asynchronous operations give us more flexibility in handling incoming requests and improve performance.

### Standardized Format
One thing you may have noticed in the [Password Hashing](#Password-Hashing) section is that we have not yet mentioned [salts](https://en.wikipedia.org/wiki/Salt_(cryptography)). Though a typical user table in a database would include both a salt and a hash field, bcrypt combines the two when generating the hash, as well as incorporating several other parameters needed to compare plaintext passwords to the hashes later. In addition, bcrypt hashes are a consistant 60 characters long, of which 31 represent the hashed password while the remaining 29 represent the salt, algorithm designation, and number of rounds. 

None of the features mentioned in this section affect the security of our password hashing directly. Instead, the standardized format and inclusion of bcrypt parameters removes a burden from our shoulder. We, as developers, do not need to keep track of which bcrypt algorithm was used, what the salt is or how to generate it, or how many rounds a password may use. All of this information that is necessary to hash a password is encoded within the hash given to us by bcrypt. What this means is that as our security goals change and we make the hashing process faster or more secure by altering bcrypt configurations, each user's password hash stores the exact parameters used to construct it, and thus older hashes will not be impacted by changes to the hashing process.

### Module Popularity
Unlike the previous sections, this section is more hypothetical. Bcrypt is an open source security module which, between 2/8/21 and 2/15/21, had over 336,000 downloads. In addition, it is still being actively maintained and updated, with the most recent version release happening in June of 2020. Though there are arguments to be made about whether open source code is more secure than proprietary software (see [here](https://doi-org.ezpxy-web-p-u01.wpi.edu/10.1016/S1361-3723(20)30062-2)) we believe that because this module is popular, still being updated, and staff are actively working on [issues](https://github.com/kelektiv/node.bcrypt.js/issues) that its users report on github, this module can be considered secure for the purposes of this web app.

## JWT Generation
When logging a user in, 

## Firebase Authentication

## Firebase Security Rules

## Service Account Development


# Development Help

## Push
Push to git using normal git commands

## Deploy to firebase
Run 'firebase deploy' in the Server folder

## Test entirely locally
Run 'firebase emulators:start'

