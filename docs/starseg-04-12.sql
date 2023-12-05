-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 04-Dez-2023 às 21:59
-- Versão do servidor: 10.4.28-MariaDB
-- versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `starseg`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `access`
--

CREATE TABLE `access` (
  `accessId` int(11) NOT NULL,
  `lobbyId` int(11) NOT NULL,
  `local` varchar(191) DEFAULT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `visitorId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `endTime` datetime(3) DEFAULT NULL,
  `memberId` int(11) DEFAULT NULL,
  `operatorId` int(11) NOT NULL,
  `startTime` datetime(3) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `updatedAt` datetime(3) NOT NULL,
  `comments` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `addresstype`
--

CREATE TABLE `addresstype` (
  `addressTypeId` int(11) NOT NULL,
  `description` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `addresstype`
--

INSERT INTO `addresstype` (`addressTypeId`, `description`) VALUES
(1, 'LOTE'),
(2, 'TÍTULO'),
(3, 'APTO');

-- --------------------------------------------------------

--
-- Estrutura da tabela `device`
--

CREATE TABLE `device` (
  `deviceId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `ip` varchar(191) NOT NULL,
  `deviceModelId` int(11) NOT NULL,
  `lobbyId` int(11) NOT NULL,
  `description` varchar(191) NOT NULL,
  `ramal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `device`
--

INSERT INTO `device` (`deviceId`, `name`, `ip`, `deviceModelId`, `lobbyId`, `description`, `ramal`) VALUES
(1, 'Dispositivo 2', '192.168.3.5', 1, 2, 'Leitor de saída morador', 115),
(2, 'teste', 'teste', 1, 1, 'teste', 1),
(3, 'teste', '192.185.6.3', 1, 1, 'entrada morador', 12);

-- --------------------------------------------------------

--
-- Estrutura da tabela `devicemodel`
--

CREATE TABLE `devicemodel` (
  `deviceModelId` int(11) NOT NULL,
  `model` varchar(191) NOT NULL,
  `brand` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `devicemodel`
--

INSERT INTO `devicemodel` (`deviceModelId`, `model`, `brand`, `description`) VALUES
(1, 'SS 3540 MF FACE EX', 'Intelbras', 'Leitor Facial'),
(2, 'FaceID', 'ControlID', '');

-- --------------------------------------------------------

--
-- Estrutura da tabela `lobby`
--

CREATE TABLE `lobby` (
  `lobbyId` int(11) NOT NULL,
  `cnpj` varchar(191) NOT NULL,
  `responsible` varchar(191) NOT NULL,
  `telephone` varchar(191) NOT NULL,
  `schedules` varchar(191) NOT NULL,
  `procedures` varchar(191) DEFAULT NULL,
  `datasheet` varchar(191) DEFAULT NULL,
  `cep` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `complement` varchar(191) DEFAULT NULL,
  `neighborhood` varchar(191) NOT NULL,
  `number` varchar(191) NOT NULL,
  `state` varchar(191) NOT NULL,
  `street` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `type` enum('CONDOMINIUM','COMPANY') NOT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `lobby`
--

INSERT INTO `lobby` (`lobbyId`, `cnpj`, `responsible`, `telephone`, `schedules`, `procedures`, `datasheet`, `cep`, `city`, `complement`, `neighborhood`, `number`, `state`, `street`, `name`, `createdAt`, `type`, `updatedAt`) VALUES
(1, '33.743.214/0001-00', 'Daniela Gonçalves', '11968394212', 'Seg a Sex - 6h a 22h', NULL, NULL, '36305-213', 'Extrema', NULL, 'Bom Pastor', '537', 'MG', 'Rua Quirino Ferreira da Silva', 'Laranjeiras', '2023-12-04 16:44:02.185', 'CONDOMINIUM', '2023-12-04 16:44:02.185'),
(2, '43.556.986/0001-00', 'Walter Diaz', '11965423567', '24/7', NULL, NULL, '12970-000', 'Piracaia', NULL, 'Boa Vista', '123', 'SP', 'Avenida Peixe Frito', 'San Lorenzo', '2023-12-04 16:46:55.731', 'CONDOMINIUM', '2023-12-04 16:46:55.731'),
(3, '54.765.856/7131-45', 'Elaine Souza', '(11) 96303-5552', '24/7', '', '', '12970-000', 'Piracaia', '', 'Boa vista', '154', 'SP', 'Alameda Garça', 'Boa Vista', '2023-12-04 16:57:39.613', 'CONDOMINIUM', '2023-12-04 16:57:39.613');

-- --------------------------------------------------------

--
-- Estrutura da tabela `lobbycalendar`
--

CREATE TABLE `lobbycalendar` (
  `lobbyCalendarId` int(11) NOT NULL,
  `date` datetime(3) NOT NULL,
  `description` varchar(191) NOT NULL,
  `lobbyId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `lobbyproblem`
--

CREATE TABLE `lobbyproblem` (
  `lobbyProblemId` int(11) NOT NULL,
  `description` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `lobbyId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `operatorId` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `logging`
--

CREATE TABLE `logging` (
  `logId` int(11) NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `method` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `userAgent` varchar(191) NOT NULL,
  `operatorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `member`
--

CREATE TABLE `member` (
  `memberId` int(11) NOT NULL,
  `type` enum('RESIDENT','EMPLOYEE') NOT NULL,
  `profileUrl` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `rg` varchar(191) NOT NULL,
  `cpf` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `comments` varchar(191) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `faceAccess` varchar(191) DEFAULT NULL,
  `biometricAccess` varchar(191) DEFAULT NULL,
  `remoteControlAccess` varchar(191) DEFAULT NULL,
  `passwordAccess` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `addressTypeId` int(11) DEFAULT NULL,
  `accessPeriod` varchar(191) DEFAULT NULL,
  `position` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `lobbyId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `operator`
--

CREATE TABLE `operator` (
  `operatorId` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `type` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `operator`
--

INSERT INTO `operator` (`operatorId`, `username`, `name`, `password`, `type`, `createdAt`, `updatedAt`) VALUES
(1, 'micael', 'Micael', '$2b$10$L0NHBTEtEl/FEoYyUgpyG.peCSpfzSuFrWQnb.beLNWG6oCiZtiTy', 'ADMIN', '2023-12-04 16:43:07.003', '2023-12-04 16:43:07.003');

-- --------------------------------------------------------

--
-- Estrutura da tabela `scheduling`
--

CREATE TABLE `scheduling` (
  `reason` varchar(191) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `visitorId` int(11) NOT NULL,
  `lobbyId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `location` varchar(191) NOT NULL,
  `memberId` int(11) DEFAULT NULL,
  `operatorId` int(11) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `updatedAt` datetime(3) NOT NULL,
  `schedulingId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tag`
--

CREATE TABLE `tag` (
  `tagId` int(11) NOT NULL,
  `value` varchar(191) NOT NULL,
  `tagTypeId` int(11) NOT NULL,
  `memberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tagtype`
--

CREATE TABLE `tagtype` (
  `tagTypeId` int(11) NOT NULL,
  `description` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `tagtype`
--

INSERT INTO `tagtype` (`tagTypeId`, `description`) VALUES
(1, 'Facial'),
(2, 'Biometria'),
(3, 'Controle Remoto'),
(4, 'Tag Veicular'),
(5, 'Cartão'),
(6, 'Tag'),
(7, 'Senha');

-- --------------------------------------------------------

--
-- Estrutura da tabela `telephone`
--

CREATE TABLE `telephone` (
  `number` varchar(191) NOT NULL,
  `memberId` int(11) NOT NULL,
  `telephoneId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `vehicle`
--

CREATE TABLE `vehicle` (
  `vehicleId` int(11) NOT NULL,
  `licensePlate` varchar(191) NOT NULL,
  `brand` varchar(191) DEFAULT NULL,
  `model` varchar(191) DEFAULT NULL,
  `color` varchar(191) DEFAULT NULL,
  `comments` varchar(191) DEFAULT NULL,
  `memberId` int(11) NOT NULL,
  `tag` varchar(191) DEFAULT NULL,
  `vehicleTypeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `vehicletype`
--

CREATE TABLE `vehicletype` (
  `vehicleTypeId` int(11) NOT NULL,
  `description` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `vehicletype`
--

INSERT INTO `vehicletype` (`vehicleTypeId`, `description`) VALUES
(1, 'Carro'),
(2, 'Moto'),
(3, 'Caminhão'),
(4, 'Van'),
(5, 'Ônibus');

-- --------------------------------------------------------

--
-- Estrutura da tabela `visitor`
--

CREATE TABLE `visitor` (
  `visitorId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `rg` varchar(191) NOT NULL,
  `cpf` varchar(191) NOT NULL,
  `visitorTypeId` int(11) NOT NULL,
  `company` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `endDate` datetime(3) DEFAULT NULL,
  `phone` varchar(191) NOT NULL,
  `profileUrl` varchar(191) DEFAULT NULL,
  `relation` varchar(191) DEFAULT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `updatedAt` datetime(3) NOT NULL,
  `lobbyLobbyId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `visitortype`
--

CREATE TABLE `visitortype` (
  `visitorTypeId` int(11) NOT NULL,
  `description` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `visitortype`
--

INSERT INTO `visitortype` (`visitorTypeId`, `description`) VALUES
(1, 'Visita Social'),
(2, 'Prestador de Serviço');

-- --------------------------------------------------------

--
-- Estrutura da tabela `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('0e65cd58-e303-46c0-aede-d276f67e144b', '4a3195a3102ce3235c86cdbfbc4fa0c1b9c031fd4c6d53931237ad88b7b96242', '2023-12-04 16:26:05.090', '20231031193210_v1_2', NULL, NULL, '2023-12-04 16:26:05.064', 1),
('46960e6c-847c-4957-945f-2e201925cace', '9063175f14d80a921ed1531c28dce0452673381040c9cd05cee438f8ecbf99f6', '2023-12-04 16:26:05.264', '20231031200550_v1_3', NULL, NULL, '2023-12-04 16:26:05.091', 1),
('54879eed-755c-439d-8bc9-bdac00035275', 'a2d3154be1fc745a16c4d185d1e90771c26dfd59a2249a250762f10f41b35d8b', '2023-12-04 16:26:04.938', '20231031192044_v1', NULL, NULL, '2023-12-04 16:26:04.186', 1),
('66c69a3b-220c-4669-8f2b-9ed4cfed4c8d', '2f032303d466c2282680b5bbfc5b7a7aa0bf1186b5adc767da22c3fcc99948f0', '2023-12-04 16:26:06.724', '20231121172051_v3_1_3', NULL, NULL, '2023-12-04 16:26:06.661', 1),
('68df19b1-ebb0-49af-99bd-b27c3489c158', 'fa6161d00f7fc9a67392078251af70df8c8e959233e4a9849f5a81448a502521', '2023-12-04 16:26:05.063', '20231031192557_v1_1', NULL, NULL, '2023-12-04 16:26:04.939', 1),
('81a0ac67-7a01-4e08-b9cb-f68ef2f9ce83', '3147d8dc4e29c1a652fefe1376cd7d1bd57e597ec70cc24361794502110db577', '2023-12-04 16:26:05.376', '20231101174342_v1_4', NULL, NULL, '2023-12-04 16:26:05.265', 1),
('836945c1-24ac-4b3b-98d4-c802909ddd32', 'bd918b3c2acf758b3d129492c709079f4342c8d9ce6eba1232bb3c78821cfdd4', '2023-12-04 16:26:06.356', '20231113192610_v3_0', NULL, NULL, '2023-12-04 16:26:05.523', 1),
('a42421a6-6093-46d5-bf48-c246a218b386', 'a89f387d8d0bea292ac461a944c6c16b5acbf8f0ab8ee72607ade50bd52d83a6', '2023-12-04 16:26:05.444', '20231101200021_v1_5', NULL, NULL, '2023-12-04 16:26:05.377', 1),
('af77312f-b1b4-4c54-a47c-1bff3af90099', '4e16ebe99ea87772ad700d676251810cbeeef00ba8d6d00e993fd9d93818ca8c', '2023-12-04 16:26:05.521', '20231101202038_v1_7', NULL, NULL, '2023-12-04 16:26:05.506', 1),
('b09eb718-ea86-4420-aeab-4820e9d31f8b', '06d40d8d69525fa3661560222a0fc4582f61de9b108ea55efbdab7bbefd48f8c', '2023-12-04 16:26:06.660', '20231116201831_v3_1_2', NULL, NULL, '2023-12-04 16:26:06.597', 1),
('c4df1b31-5bb3-40d2-8ca0-c05acf1833e4', 'f8b32852dd1607e943e77c6b63b3d3e7a1c5d4d81531fdf91776167a94f02720', '2023-12-04 16:26:06.519', '20231114192544_v3_1', NULL, NULL, '2023-12-04 16:26:06.357', 1),
('d8f82bbb-94f6-4b7c-86ea-9bf49c477d93', '21e611806977f7dbaf17cc91c3af6f0aed740ad87b3806054cd95d3a4d8fac3e', '2023-12-04 16:26:05.505', '20231101200739_v1_6', NULL, NULL, '2023-12-04 16:26:05.444', 1),
('dbf1c5fb-61e1-49e9-bd14-9f71688f2362', '5796de5760b85a9ba1f019a763d90f4a857fb5d9fa63597096210b201f749d34', '2023-12-04 16:26:04.185', '20231030140954_init', NULL, NULL, '2023-12-04 16:26:04.071', 1),
('ef96d473-fc7b-4843-a290-4d45babe64fc', 'bd5ef07baa5e99e224a0dbc3d8df1f079074c5aa31d4d58d2ef66f1314bb0848', '2023-12-04 16:26:06.595', '20231114192801_v3_1_1', NULL, NULL, '2023-12-04 16:26:06.520', 1);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `access`
--
ALTER TABLE `access`
  ADD PRIMARY KEY (`accessId`),
  ADD KEY `Access_lobbyId_fkey` (`lobbyId`),
  ADD KEY `Access_memberId_fkey` (`memberId`),
  ADD KEY `Access_operatorId_fkey` (`operatorId`),
  ADD KEY `Access_visitorId_fkey` (`visitorId`);

--
-- Índices para tabela `addresstype`
--
ALTER TABLE `addresstype`
  ADD PRIMARY KEY (`addressTypeId`);

--
-- Índices para tabela `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`deviceId`),
  ADD KEY `Device_deviceModelId_fkey` (`deviceModelId`),
  ADD KEY `Device_lobbyId_fkey` (`lobbyId`);

--
-- Índices para tabela `devicemodel`
--
ALTER TABLE `devicemodel`
  ADD PRIMARY KEY (`deviceModelId`);

--
-- Índices para tabela `lobby`
--
ALTER TABLE `lobby`
  ADD PRIMARY KEY (`lobbyId`),
  ADD UNIQUE KEY `Lobby_cnpj_key` (`cnpj`);

--
-- Índices para tabela `lobbycalendar`
--
ALTER TABLE `lobbycalendar`
  ADD PRIMARY KEY (`lobbyCalendarId`),
  ADD KEY `LobbyCalendar_lobbyId_fkey` (`lobbyId`);

--
-- Índices para tabela `lobbyproblem`
--
ALTER TABLE `lobbyproblem`
  ADD PRIMARY KEY (`lobbyProblemId`),
  ADD KEY `LobbyProblem_lobbyId_fkey` (`lobbyId`),
  ADD KEY `LobbyProblem_operatorId_fkey` (`operatorId`);

--
-- Índices para tabela `logging`
--
ALTER TABLE `logging`
  ADD PRIMARY KEY (`logId`),
  ADD KEY `Logging_operatorId_fkey` (`operatorId`);

--
-- Índices para tabela `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`memberId`),
  ADD UNIQUE KEY `Member_cpf_key` (`cpf`),
  ADD KEY `Member_addressTypeId_fkey` (`addressTypeId`),
  ADD KEY `Member_lobbyId_fkey` (`lobbyId`);

--
-- Índices para tabela `operator`
--
ALTER TABLE `operator`
  ADD PRIMARY KEY (`operatorId`),
  ADD UNIQUE KEY `Operator_username_key` (`username`);

--
-- Índices para tabela `scheduling`
--
ALTER TABLE `scheduling`
  ADD PRIMARY KEY (`schedulingId`),
  ADD KEY `Scheduling_visitorId_fkey` (`visitorId`),
  ADD KEY `Scheduling_lobbyId_fkey` (`lobbyId`),
  ADD KEY `Scheduling_memberId_fkey` (`memberId`),
  ADD KEY `Scheduling_operatorId_fkey` (`operatorId`);

--
-- Índices para tabela `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`tagId`),
  ADD KEY `Tag_tagTypeId_fkey` (`tagTypeId`),
  ADD KEY `Tag_memberId_fkey` (`memberId`);

--
-- Índices para tabela `tagtype`
--
ALTER TABLE `tagtype`
  ADD PRIMARY KEY (`tagTypeId`);

--
-- Índices para tabela `telephone`
--
ALTER TABLE `telephone`
  ADD PRIMARY KEY (`telephoneId`),
  ADD KEY `Telephone_memberId_fkey` (`memberId`);

--
-- Índices para tabela `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`vehicleId`),
  ADD UNIQUE KEY `Vehicle_licensePlate_key` (`licensePlate`),
  ADD UNIQUE KEY `Vehicle_tag_key` (`tag`),
  ADD KEY `Vehicle_vehicleTypeId_fkey` (`vehicleTypeId`),
  ADD KEY `Vehicle_memberId_fkey` (`memberId`);

--
-- Índices para tabela `vehicletype`
--
ALTER TABLE `vehicletype`
  ADD PRIMARY KEY (`vehicleTypeId`);

--
-- Índices para tabela `visitor`
--
ALTER TABLE `visitor`
  ADD PRIMARY KEY (`visitorId`),
  ADD UNIQUE KEY `Visitor_cpf_key` (`cpf`),
  ADD KEY `Visitor_visitorTypeId_fkey` (`visitorTypeId`),
  ADD KEY `Visitor_lobbyLobbyId_fkey` (`lobbyLobbyId`);

--
-- Índices para tabela `visitortype`
--
ALTER TABLE `visitortype`
  ADD PRIMARY KEY (`visitorTypeId`);

--
-- Índices para tabela `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `access`
--
ALTER TABLE `access`
  MODIFY `accessId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `addresstype`
--
ALTER TABLE `addresstype`
  MODIFY `addressTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `device`
--
ALTER TABLE `device`
  MODIFY `deviceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `devicemodel`
--
ALTER TABLE `devicemodel`
  MODIFY `deviceModelId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `lobby`
--
ALTER TABLE `lobby`
  MODIFY `lobbyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `lobbycalendar`
--
ALTER TABLE `lobbycalendar`
  MODIFY `lobbyCalendarId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `lobbyproblem`
--
ALTER TABLE `lobbyproblem`
  MODIFY `lobbyProblemId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `logging`
--
ALTER TABLE `logging`
  MODIFY `logId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `member`
--
ALTER TABLE `member`
  MODIFY `memberId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `operator`
--
ALTER TABLE `operator`
  MODIFY `operatorId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `scheduling`
--
ALTER TABLE `scheduling`
  MODIFY `schedulingId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tag`
--
ALTER TABLE `tag`
  MODIFY `tagId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tagtype`
--
ALTER TABLE `tagtype`
  MODIFY `tagTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `telephone`
--
ALTER TABLE `telephone`
  MODIFY `telephoneId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `vehicleId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `vehicletype`
--
ALTER TABLE `vehicletype`
  MODIFY `vehicleTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `visitor`
--
ALTER TABLE `visitor`
  MODIFY `visitorId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `visitortype`
--
ALTER TABLE `visitortype`
  MODIFY `visitorTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `access`
--
ALTER TABLE `access`
  ADD CONSTRAINT `Access_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Access_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Access_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operator` (`operatorId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Access_visitorId_fkey` FOREIGN KEY (`visitorId`) REFERENCES `visitor` (`visitorId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `device`
--
ALTER TABLE `device`
  ADD CONSTRAINT `Device_deviceModelId_fkey` FOREIGN KEY (`deviceModelId`) REFERENCES `devicemodel` (`deviceModelId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Device_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `lobbycalendar`
--
ALTER TABLE `lobbycalendar`
  ADD CONSTRAINT `LobbyCalendar_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `lobbyproblem`
--
ALTER TABLE `lobbyproblem`
  ADD CONSTRAINT `LobbyProblem_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `LobbyProblem_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operator` (`operatorId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `logging`
--
ALTER TABLE `logging`
  ADD CONSTRAINT `Logging_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operator` (`operatorId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `member`
--
ALTER TABLE `member`
  ADD CONSTRAINT `Member_addressTypeId_fkey` FOREIGN KEY (`addressTypeId`) REFERENCES `addresstype` (`addressTypeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Member_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `scheduling`
--
ALTER TABLE `scheduling`
  ADD CONSTRAINT `Scheduling_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Scheduling_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Scheduling_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operator` (`operatorId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Scheduling_visitorId_fkey` FOREIGN KEY (`visitorId`) REFERENCES `visitor` (`visitorId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `tag`
--
ALTER TABLE `tag`
  ADD CONSTRAINT `Tag_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Tag_tagTypeId_fkey` FOREIGN KEY (`tagTypeId`) REFERENCES `tagtype` (`tagTypeId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `telephone`
--
ALTER TABLE `telephone`
  ADD CONSTRAINT `Telephone_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `vehicle`
--
ALTER TABLE `vehicle`
  ADD CONSTRAINT `Vehicle_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Vehicle_vehicleTypeId_fkey` FOREIGN KEY (`vehicleTypeId`) REFERENCES `vehicletype` (`vehicleTypeId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `visitor`
--
ALTER TABLE `visitor`
  ADD CONSTRAINT `Visitor_lobbyLobbyId_fkey` FOREIGN KEY (`lobbyLobbyId`) REFERENCES `lobby` (`lobbyId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Visitor_visitorTypeId_fkey` FOREIGN KEY (`visitorTypeId`) REFERENCES `visitortype` (`visitorTypeId`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
