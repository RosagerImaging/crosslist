# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "Create an Account" [level=1] [ref=e6]
      - paragraph [ref=e7]: Enter your email below to create your account
    - generic [ref=e8]:
      - generic [ref=e10]:
        - generic [ref=e11]:
          - generic [ref=e12]: Email
          - textbox "Email" [ref=e13]:
            - /placeholder: name@example.com
        - generic [ref=e14]:
          - generic [ref=e15]: Password
          - textbox "Password" [ref=e16]
        - generic [ref=e17]:
          - generic [ref=e18]: Confirm Password
          - textbox "Confirm Password" [ref=e19]
        - button "Sign Up with Email" [ref=e20]
      - generic [ref=e25]: Or continue with
      - button "Google Google" [ref=e26]:
        - img "Google" [ref=e27]
        - text: Google
      - paragraph [ref=e29]:
        - link "Already have an account? Login" [ref=e30] [cursor=pointer]:
          - /url: /login
  - button "Open Next.js Dev Tools" [ref=e36] [cursor=pointer]:
    - img [ref=e37]
  - alert [ref=e40]
```