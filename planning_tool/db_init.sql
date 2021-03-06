create database if not exists planning_tool;

create table if not exists planning_tool.Unit (
    unit_id int primary key auto_increment,
    unit_name varchar(100),
    unit_creator varchar(50),
    unit_weeks int
);

create table if not exists planning_tool.UnitSession (
    unitsession_id int primary key auto_increment,
    unitsession_title varchar(50),
    unitsession_description varchar(500),
    unitsession_type varchar(10),
    unitsession_weekno int,
    unitsession_unit_id int,
    constraint foreign key (unitsession_unit_id) references Unit(unit_id)
);

create table if not exists planning_tool.SessionGroup (
    sessiongroup_id int primary key auto_increment,
    sessiongroup_group_id int,
    sessiongroup_group_session_id int,
    constraint foreign key (sessiongroup_group_session_id) references UnitSession(unitsession_id)
)