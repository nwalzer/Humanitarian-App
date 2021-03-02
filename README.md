# Humanitarian-App CS MQP

Proof of concept application.

Deployment can be found [here](https://humanitarian-app-development.web.app)

This web app utilizes a REACT frontend with a nodeJS and firebase backend. 

# Security Developments
- [Password hashing](#Password-Hashing)
- [JWT generation](#JWT-Generation)
- [Firebase authentication](#Firebase-Authentication)
- [Firebase security rules](#Firebase-Security-Rules)
- [Service account development](#Service-Account-Development)
- [Protected REACT routes](#Protected-Routes)

## Password Hashing
In order to comply with general security recommendations, our user passwords are salted and hashed. We utilize the [bcrypt](https://www.npmjs.com/package/bcrypt) nodeJS module to handle password hashes and comparisons. There are several advantages to using the bcrypt module: 
- [Performance vs security can be altered as needed for hashing passwords](#Workload-Configurability)
- [Hashing and password comparisons can be performed asynchronously](#Asynchronous-Hashing)
- [Standardized hash formats](#Standardized-Format)
- [Widespread use](#Module-Popularity)

### Workload Configurability
When hashing a password, we use a default 2^12 iterations of processing, giving us a performance of 2-3 hashes/sec on a 2GHz core. By reducing the number of 'rounds' bcrypt utilizes (where x rounds = 2^x iterations) we can increase performance should we receive a high volume of user registrations. Similarly, should our firebase environment have a far greater performance than expected, or extra security is needed, we can exponentially increase the number of rounds to greatly increase the time it would take to generate hashes for our environment. Such configurability allows us to account for [Moore's Law](https://en.wikipedia.org/wiki/Moore%27s_law) and keep our hashes cryptographically secure. 

### Asynchronous Hashing
Though security is, obviously, a major concern, there is a limit to how secure something can be before the cost to performance (and subsequent loss of user traffic) outweighs the security benefit. This is why we use a default 12 rounds for password hashing, as 2-3 hashes/sec is more than enough for a small-scale prototype web app like ours. That being said, bcrypt offers a performance boost by having asynchronous capabilities. Since hashing and hash comparisons are CPU-intensive operations, a synchronous operation will block the server from performing other operations, including serving webpages to other clients. The asynchronous operations give us more flexibility in handling incoming requests and improve performance.

### Standardized Format
One thing you may have noticed in the [Password Hashing](#Password-Hashing) section is that we have not yet mentioned [salts](https://en.wikipedia.org/wiki/Salt_(cryptography)). Though a typical user table in a database would include both a salt and a hash field, bcrypt combines the two when generating the hash, as well as incorporating several other parameters needed to compare plaintext passwords to the hashes later. In addition, bcrypt hashes are a consistent 60 characters long, of which 31 represent the hashed password while the remaining 29 represent the salt, algorithm designation, and number of rounds. 

![bcrypt-hash-example](/pictures/bcrypt-hash.PNG "Example bcrypt hash")

None of the features mentioned in this section affect the security of our password hashing directly. Instead, the standardized format and inclusion of bcrypt parameters removes a burden from our shoulder. We, as developers, do not need to keep track of which bcrypt algorithm was used, what the salt is or how to generate it, or how many rounds a password may use. All of this information that is necessary to hash a password is encoded within the hash given to us by bcrypt. What this means is that as our security goals change and we make the hashing process faster or more secure by altering bcrypt configurations, each user's password hash stores the exact parameters used to construct it, and thus older hashes will not be impacted by changes to the hashing process.

### Module Popularity
Unlike the previous sections, this section is more hypothetical. Bcrypt is an open source security module which, between 2/8/21 and 2/15/21, had over 336,000 downloads. In addition, it is still being actively maintained and updated, with the most recent version release happening in June of 2020. Though there are arguments to be made about whether open source code is more secure than proprietary software (see [here](https://doi-org.ezpxy-web-p-u01.wpi.edu/10.1016/S1361-3723(20)30062-2)) we believe that because this module is popular, still being updated, and staff are actively working on [issues](https://github.com/kelektiv/node.bcrypt.js/issues) that its users report on github, this module can be considered secure for the purposes of this web app.

## JWT Generation
When a user logs in, their username and password are sent to our server, which confirms that validity of the credentials. Once the credentials are verified, the server generates a token that contains the user's unique user ID (UID). This token is in the form of a [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token) (JWT). All of the tokens are generated through the Firebase Admin Auth API. Though we do not specify any additional claims beyond the UID, by using JWTs we can, if needed, specify a user to have certain privileges or roles. The token-based system also offers greater flexibility in our hashing implementations than other methods of confirming a user's identity through Firebase.

## Firebase Authentication
Once a token has been generated and returned to the user, it is sent back to Firebase to authenticate the user. This authentication process stores the JWT in local session storage in the browser. When pages in our web app are loaded, we check the status of the Firebase Auth object, and if a user has data stored in the local storage they are considered 'logged in.' The Firebase Authentication object has the benefit of communicating this token to our database when querying, which is used by the access rules outlined in the next section.

## Firebase Security Rules
For this web app we used Firebase's [Firestore database](https://firebase.google.com/docs/firestore/). Part of the functionality of Firestore is that anyone is able to query. To combat the glaring security issues associated with letting anyone query for any data, Firestore lets developers define access rules that can change who can access which data in which circumstances. These security rules are made more powerful by incorporating Firebase Authentication. As mentioned in the previous section, the Firebase Authentication object passes along our JWT to Firebase when we query Firestore. When Firestore is determining whether the query can be allowed through, we can use the JWT to understand who is querying and what permissions they have. For example, user profile information, such as username, password hash, and phone number, is set so that a user can only access a profile's information if the UID of the requester is the same as the UID of the information being requested. That is, a user can only query for data they own. 

![user-info-access-rules](/pictures/user-info-rules.PNG "Profile Information Query Rules")

The security rules also allow us to restrict who can write to Firestore. By default we do not allow anyone to write to the database. Though, at first glance, it seems as though we would never be able to populate the database with new information, what this actually means is that no *client* can write to the database. Our server utilizes the Firebase Admin SDK and is granted permissions by an associated service account (see [Service-Account-Development](#Service-Account-Development)) to read and write to the database. Our server only ever reads the user's password hash to perform comparisons on login, however all information written to the database must pass through our server. This allows us to filter and format incoming data to prevent malicious or unwanted information from being stored.

## Service Account Development
Running our server using the Firebase Admin SDK means that it can bypass all database security rules, opening up a major vulnerability should our server be compromised. Thankfully, in order to utilize the Admin SDK the SDK must be initialized with a service account JSON file. Firebase allows us to create as many service accounts as needed, each with their own unique set of permissions. The account used by the server has been granted database read/write access and authentication privileges. Should an unuathorized user gain access to our server we can simply revoke the account's privileges, halting all Firebase-related server activity. In our production environment this service account JSON exists as a physical file within Firebase's cloud servers. During development, however, each developer has been given a copy of this file, and certain environment variables can be configured to use this file, which the Admin SDK automatically reads upon initialization. Because the file does not need to reside within this codebase until the code is deploy to production, this private service account file does not need to be pushed to the repo and is therefore never made public. 

## Protected Routes
As part of our REACT frontend, we needed to be able to specify specific web components that users could only access under certain conditions; namely, we needed to make our specific resource map and associated components unaccessible to users who weren't logged in. To do this, we utilized a REACT component that conditionally renders a specified component. When we want to render a protected component we instead insert one of these protected routes and specify the component to render if the condition passes. Within the protected route component, we first render a blank page and set the component's internal state to null. Once the component is rendered we call firebase auth and attempt to get the user that is currently signed in. If no such user exists, we change the protected route's internal state to false and redirect to the home page. If a user is signed in, we change the route's internal state to true and render the component we were protecting.


# Development Help

## Push
Push to git using normal git commands

## Deploy to firebase
Run 'firebase deploy' in the Server folder

## Test entirely locally
Run 'firebase emulators:start'

