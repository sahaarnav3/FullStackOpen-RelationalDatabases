-- Command 1
CREATE TABLE blogs (id SERIAL PRIMARY KEY, author TEXT, url TEXT NOT NULL, title TEXT NOT NULL, likes INT DEFAULT 0);

-- Command 2 and 3
INSERT INTO blogs (author, url, title, likes) values ('Dan Abramov', 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', 'Go To Statement Considered Harmful', 37);
INSERT INTO blogs (author, url, title, likes) values ('Ryan Dahl', 'https://example.com/full-stack-development', 'The Road to Full Stack Development', 42);