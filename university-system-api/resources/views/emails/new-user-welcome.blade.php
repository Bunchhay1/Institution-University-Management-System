<!DOCTYPE html>
<html>
<head>
    <title>Welcome!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Welcome to the University, {{ $user->name }}!</h2>

    <p>A new account has been created for you in our system.</p>

    <p>You can log in at our portal with the following credentials:</p>

    <ul style="list-style: none; padding: 0;">
        <li><strong>Email:</strong> {{ $user->email }}</li>
        <li><strong>Password:</strong> {{ $tempPassword }}</li>
    </ul>

    <p>It is highly recommended you change this password upon your first login.</p>

    <p>Thank you,</p>
    <p>The University Administration Team</p>
</body>
</html>