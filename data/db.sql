CREATE TABLE `repos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `nameWithOwner` varchar(1024) DEFAULT NULL,
  `stargazersCount` int(11) DEFAULT NULL,
  `forksCount` int(11) DEFAULT NULL,
  `watchersCount` int(11) DEFAULT NULL,
  `issuesOpenCount` int(11) DEFAULT NULL,
  `pullRequestsOpenCount` int(11) DEFAULT NULL,
  `pullRequestsClosedCount` int(11) DEFAULT NULL,
  `issuesTotalClosedCount` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `events` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `login` varchar(1024) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
