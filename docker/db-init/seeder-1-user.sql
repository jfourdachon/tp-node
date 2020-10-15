-- both passwords are 'password'
INSERT INTO users (username, email, user_password, user_role) VALUES ('administrator', 'admin@admin.com', '$2a$10$t/7InRheUWy6t1xDVcl6Su3iT1WMHCOIS0ulrAAtzx9BZgmgS.CCa', 'admin');
INSERT INTO users (username, email, user_password, user_role) VALUES ('classic-user', 'user@user.com', '$2a$10$k3nkbFQBJ82xF/jm93dW2OvzU48fGnwByF5ffdyLiFzNuHYDMr5di', 'user');
