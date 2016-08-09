CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email varchar(50) NOT NULL UNIQUE,
    password varchar(50) NOT NULL,
    zipcode varchar(10),
    country varchar(2)
);

CREATE TABLE Themes (
    id SERIAL PRIMARY KEY,
    name varchar(25) NOT NULL UNIQUE
);

CREATE TABLE Recordings (
    id SERIAL PRIMARY KEY,
    public boolean NOT NULL DEFAULT True,
    theme_id int REFERENCES Themes(id) NOT NULL,
    user_id int REFERENCES Users(id),
    created_at timestamp DEFAULT now(),
    data text NOT NULL
);

CREATE TABLE Views (
    id SERIAL PRIMARY KEY,
    recording_id int REFERENCES Recordings(id),
    ip_address inet,
    viewed_at timestamp DEFAULT now()
);