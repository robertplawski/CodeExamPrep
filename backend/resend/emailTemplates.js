export const VERIFICATION_EMAIL_SPAN = `
<span style='margin: 0; box-sizing: border-box; background-color: #242424; color: white; border-radius: 0.5rem; padding: 0.5rem; font-weight: bold; text-decoration: underline 2px; display: flex; gap: 0.5rem; margin-top: -0.5rem; margin-bottom: -1rem; flex-direction: row; justify-content: center; align-items: center;'>{digit}</span>
`;
export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="pl" style="margin: 0; box-sizing: border-box;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Zweryfikuj swój adres email</title>
    </head><body style="margin: 0; box-sizing: border-box; font-family: Sans-serif; text-align: center; font-size: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; justify-content: center; align-items: center; min-height: 100vh; padding: 2rem;">
      <main style="margin: 0; box-sizing: border-box; max-width: 24rem; display: flex; flex-direction: column; gap: 1rem; justify-content: center; align-items: center;">
        <p style="margin: 0; box-sizing: border-box;">CodeExamPrep </p>
        <h1 style="margin: 0; box-sizing: border-box;">Witaj, {name}</h1>
        <p style="margin: 0; box-sizing: border-box;">Dziękuję za weryfikacje w serwisie, 
          <br style="margin: 0; box-sizing: border-box;">twój kod weryfikacyjny to
        </p>
        <div style="display:flex; flex-direction:row;margin-bottom:1rem;">{verificationTokenDisplay}</div>
        <p style="margin: 0; box-sizing: border-box;">Wpisz go na stronie weryfikacji emaila, aby zweryfikować adres email i ukończyć rejestrację, lub kliknij przycisk poniżej</p>

        <a href="https://cep.robertplawski.pl/api/auth/verifyEmail?token={verificationToken}"><button style="cursor:pointer; margin: 0; box-sizing: border-box; padding: 0.75rem; font-family: inherit; font-size: inherit; font-weight: bold; background-color: hsl(0, 0%, 98%); border: 0px; border-radius: 1rem; box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.35);">Zweryfikuj się</button></a>
        <p style="margin: 0; box-sizing: border-box;">Kod wygaśnie w ciągu 24 godzin, ze względów bezpieczeństwa. 
        Jeżeli nie zakładałeś konta w tym serwisie, zignoruj tą wiadomość.</p>
        <small style="margin: 0; box-sizing: border-box;">CodeExamPrep, cep.robertplawski.pl</small></main>
    </body>
</html>
`;
