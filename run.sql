/*Srcipt that creates structure for Shynder web app database*/

create table if not exists Users(
    id integer primary key,
    email text not null,
    ppassword text not null,
    username text not null,
    age integer not null,
    ddescription text not null,
    test_results text not null
);

create table if not exists Matches(
    id integer primary key,
    user1_id integer not null,
    user2_id integer,
    chat_log_file text,
    foreign key (user1_id) references Users(id),
    foreign key (user2_id) references Users(id)
);