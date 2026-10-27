# ລະບ ົ ບບ ໍ ລຫານຈ ິ ັ ດການຟ ິ ດເນ ັ ດ **(Fitness POS & Manageme** ົໍິັິັ 

ສະຫ ຼຸບໂຄງສ້າງ _Model_ ໃນ _Prisma Schema | Database: PostgreSQL | Base Currency: LAK_ 

|ລໍາດັບ|**Prisma Model**|ຊື່ພາສາລາວື່**(Table Name LA**|ໂມດູນູ**(Module)**|
|---|---|---|---|
|**1**|**User**|ຜູ້ໃຊ້ລະບົບ/ພະນັກງານ|Auth & Staff|
|**2**|**Shift**|ຜຽນເຮັດວຽກ&ລ ້ນຊັກເງິນ|Cash & Shift|
|**3**|**Member**|ຂໍ້ມູນສະມາຊິກຢິມ|Membership|
|**4**|**Package**|ແພັກເກດ&ຄອດຮຽນ|Membership|
|**5**|**MemberPackage**|ສັນຍາແພັກເກດສະມາຊິກ|Membership|
|**6**|**CheckIn**|ປະຫວັດການເຊັກອິນ|Access Control|
|**7**|**Trainer**|ຂໍ້ມູນຄູເຝິກ(Trainer)|Trainer & PT|
|**8**|**PTSession**|ປະຫວັດການສອນPT|Trainer & PT|
|**9**|**Product**|ສິນຄ້າມິນິບາ/ໜ້າຮ້ານ|Inventory & POS|
|**10**|**Order**|ບິນຂາຍ/ໃບຮັບເງິນ|Sales & Billing|
|**11**|**OrderItem**|ລາຍການໃນບິນຂາຍ|Sales & Billing|



# **<mark>ent System)</mark>** 

|ຄໍາອະທິບາຍໜ້າທ<br> ື່<br>**(Description)**|ປະລິມານຂໍ້ມູນິໍູ້**(Volume)**|
|---|---|
|ເກັບຂໍ້ມູນພະນັກງານ,ແຄດເຊຍ ແລະ ຜູ້ຈັດການ ສໍາລັບການເຂົ້າສູື່ລະ້|ໍັົູ້ື່ໜ້ອຍ(< 50 records)|
|ບັນທຶກຮອບເປ<br>ດ-ປິດຜຽນ,ກວດນັບເງິນສົດ3ສະກຼຸນ(LAK, THB, U|ປານກາງ(~2-3ຜຽນ/ມ ້)|
|ຂໍ້ມູນລູກຄ້າສະມາຊິກ,ເບ ໂທລະສັບWhatsApp,ຮູບຖື່າຍ ແລະ ລະຫັດ|ັປານກາງ(~500 - 5,000)|
|ກໍານົດປະເພດແພັກເກດ(ລາຍວັນ,ລາຍເດ ອນ,ຄູປອງນັບຄັ້ງ, PT)ແ້|ໜ້ອຍ(< 30 records)|
|ການຊ ້ແພັກເກດຂອງສະມາຊິກ,ວັນທ<br>ເລ ື່ມ,ວັນທ<br>ໝົດອາຍຼຸ ແລະ ຈໍານ|ໍຫ າຍ(~1,000 - 10,000)|
|ບັນທຶກເວລາທ<br>ສະມາຊິກສະແກນເຂົ້າໃຊ້ບໍລິການຢິມ ເພ<br>ອກວດສອບສິ|ິຫ າຍທ<br>ສຼຸດ(ຫ າຍພັນຕໍື່ເດ ອນ)|
|ຂໍ້ມູນໂປຣໄຟລ໌ຄູເຝິກ ແລະ ອັດຕາສື່ວນແບື່ງຄື່າຄອມມິດຊັນໃນການສ້|ັື່ື່ື່ິັໜ້ອຍ(< 30 records)|
|ບັນທຶກການຕັດຮອບຊົື່ວໂມງສອນPTຂອງສະມາຊິກກັບຄູເຝິກ ເພ<br>ອ|ປານກາງ(~200 - 1,000/ເດ ອນ)|
|ຂໍ້ມູນສິນຄ້າເຊັື່ນ:ນໍ້າດ ື່ມ,ເວໂປຣຕ<br>ນ,ເຄ ື່ອງດ ື່ມເກ ອແຮື່ ແລະ ຈໍານວ້<br>ບັນທຶກທຼຸລະກໍາການຂາຍ,ຮອງຮັບຫ າຍສະກຼຸນເງິນ(LAK, THB, USD|ໍໜ້ອຍ(< 100 records)<br>ຫ າຍ(30-100ບິນ/ມ ້)|
|ລາຍລະອຽດສິນຄ້າ ຫ ແພັກເກດທ<br>ຊ ້ໃນແຕື່ລະບິນ|ຫ າຍ(1-3ລາຍການ/ບິນ)|



# ວ ັ ດຈະນານ ຼຸ ກ ົ ມຂ ໍ້ ມ ູ ນສາລ ໍ ັ ບ ັຼຸົໍູ້ໍັ **Prisma ORM (Prisma Data** 

ກໍານົດ _Prisma Scalar Types, Attributes (@db, @default, @relation)_ ແລະຄໍາອະທິບາຍທຸ 

|**Prisma Mo**|**del**<br>**Field Name**|**Prisma Type   **|**Modifier / Nullabl**|
|---|---|---|---|
|**User**|**`id`**|**`String`**|`Required`|
|**User**|**`name`**|**`String`**|`Required`|
|**User**|**`phone`**|**`String`**|`Required`|
|**User**|**`passwordHash`**|**`String`**|`Required`|
|**User**|**`role`**|**`Role`**|`Required`|
|**User**|**`createdAt`**|**`DateTime`**|`Required`|
|**Shift**|**`id`**|**`String`**|`Required`|
|**Shift**|**`openedById`**|**`String`**|`Required`|
|**Shift**|**`closedById`**|**`String?`**|`Optional`|
|**Shift**|**`openedAt`**|**`DateTime`**|`Required`|
|**Shift**|**`closedAt`**|**`DateTime?`**|`Optional`|
|**Shift**|**`startCashLak`**|**`Decimal`**|`Required`|
|**Shift**|**`startCashThb`**|**`Decimal`**|`Required`|
|**Shift**|**`startCashUsd`**|**`Decimal`**|`Required`|
|**Shift**|**`actualCashLak`**|**`Decimal?`**|`Optional`|
|**Shift**|**`actualCashThb`**|**`Decimal?`**|`Optional`|
|**Shift**|**`actualCashUsd`**|**`Decimal?`**|`Optional`|
|**Shift**|**`status`**|**`ShiftStatus`**|`Required`|
|**Shift**|**`notes`**|**`String?`**|`Optional`|
|**Member**|**`id`**|**`String`**|`Required`|
|**Member**|**`memberCode`**|**`String`**|`Required`|
|**Member**|**`fullName`**|**`String`**|`Required`|
|**Member**|**`phone`**|**`String`**|`Required`|
|**Member**|**`photoUrl`**|**`String?`**|`Optional`|
|**Member**|**`status`**|**`MemberStatus`**|`Required`|
|**Member**|**`createdAt`**|**`DateTime`**|`Required`|



|**Package**|**`id`**|**`String`**|`Required`|
|---|---|---|---|
|**Package**|**`name`**|**`String`**|`Required`|
|**Package**|**`type`**|**`PackageType`**|`Required`|
|**Package**|**`durationDays`**|**`Int?`**|`Optional`|
|**Package**|**`totalSessions`**|**`Int?`**|`Optional`|
|**Package**|**`priceLak`**|**`Decimal`**|`Required`|
|**Package**|**`isActive`**|**`Boolean`**|`Required`|
|**MemberPackage**|**`id`**|**`String`**|`Required`|
|**MemberPackage**|**`memberId`**|**`String`**|`Required`|
|**MemberPackage**|**`packageId`**|**`String`**|`Required`|
|**MemberPackage**|**`startDate`**|**`DateTime`**|`Required`|
|**MemberPackage**|**`expireDate`**|**`DateTime?`**|`Optional`|
|**MemberPackage**|**`remainingSessions`**|**`Int?`**|`Optional`|
|**MemberPackage**|**`status`**|**`MembershipStatus`**|`Required`|
|**MemberPackage**|**`createdAt`**|**`DateTime`**|`Required`|
|**CheckIn**|**`id`**|**`String`**|`Required`|
|**CheckIn**|**`memberId`**|**`String`**|`Required`|
|**CheckIn**|**`memberPackageId`**|**`String?`**|`Optional`|
|**CheckIn**|**`checkedInById`**|**`String`**|`Required`|
|**CheckIn**|**`checkedInAt`**|**`DateTime`**|`Required`|
|**Trainer**|**`id`**|**`String`**|`Required`|
|**Trainer**|**`name`**|**`String`**|`Required`|
|**Trainer**|**`phone`**|**`String`**|`Required`|
|**Trainer**|**`commissionRate`**|**`Decimal`**|`Required`|
|**Trainer**|**`isActive`**|**`Boolean`**|`Required`|
|**PTSession**|**`id`**|**`String`**|`Required`|
|**PTSession**|**`memberId`**|**`String`**|`Required`|
|**PTSession**|**`trainerId`**|**`String`**|`Required`|
|**PTSession**|**`memberPackageId`**|**`String`**|`Required`|
|**PTSession**|**`sessionDate`**|**`DateTime`**|`Required`|



|**PTSession**|**`notes`**|**`String?`**|`Optional`|
|---|---|---|---|
|**Product**|**`id`**|**`String`**|`Required`|
|**Product**|**`barcode`**|**`String?`**|`Optional`|
|**Product**|**`name`**|**`String`**|`Required`|
|**Product**|**`priceLak`**|**`Decimal`**|`Required`|
|**Product**|**`stockQty`**|**`Int`**|`Required`|
|**Product**|**`isActive`**|**`Boolean`**|`Required`|
|**Order**|**`id`**|**`String`**|`Required`|
|**Order**|**`orderNo`**|**`String`**|`Required`|
|**Order**|**`shiftId`**|**`String`**|`Required`|
|**Order**|**`cashierId`**|**`String`**|`Required`|
|**Order**|**`memberId`**|**`String?`**|`Optional`|
|**Order**|**`subtotalLak`**|**`Decimal`**|`Required`|
|**Order**|**`discountLak`**|**`Decimal`**|`Required`|
|**Order**|**`totalLak`**|**`Decimal`**|`Required`|
|**Order**|**`paidCurrency`**|**`Currency`**|`Required`|
|**Order**|**`exchangeRate`**|**`Decimal`**|`Required`|
|**Order**|**`amountPaid`**|**`Decimal`**|`Required`|
|**Order**|**`changeGivenLak`**|**`Decimal`**|`Required`|
|**Order**|**`paymentMethod`**|**`PaymentMethod`**|`Required`|
|**Order**|**`slipImageUrl`**|**`String?`**|`Optional`|
|**Order**|**`createdAt`**|**`DateTime`**|`Required`|
|**OrderItem**|**`id`**|**`String`**|`Required`|
|**OrderItem**|**`orderId`**|**`String`**|`Required`|
|**OrderItem**|**`itemType`**|**`ItemType`**|`Required`|
|**OrderItem**|**`packageId`**|**`String?`**|`Optional`|
|**OrderItem**|**`productId`**|**`String?`**|`Optional`|
|**OrderItem**|**`quantity`**|**`Int`**|`Required`|
|**OrderItem**|**`unitPriceLak`**|**`Decimal`**|`Required`|
|**OrderItem**|**`subtotalLak`**|**`Decimal`**|`Required`|



# **<mark>a Dictionary)</mark>** 

ທຼຸລະກິດ 

|**Prisma Attributes & Native Type**|**s**<br>**Key**<br>|**Default Value**|
|---|---|---|
|`@id @default(uuid())`|**`PK`**|`uuid()`|
|`-`|-|`-`|
|`@unique`|**UK**|`-`|
|`-`<br>`@default(CASHIER)`|-<br>-|`-`<br>`CASHIER`|
|`@default(now())`|-|`now()`|
|`@id @default(uuid())`|**`PK`**|`uuid()`|
|`@relation("ShiftOpener")`|**`FK`**|`-`|
|`@relation("ShiftCloser")`|**`FK`**|`NULL`|
|`@default(now())`|-|`now()`|
|`-`|-|`NULL`|
|`@default(0) @db.Decimal(14, 2)`|-|`0.00`|
|`@default(0) @db.Decimal(10, 2)`|-|`0.00`|
|`@default(0) @db.Decimal(10, 2)`|-|`0.00`|
|`@db.Decimal(14, 2)`|-|`NULL`|
|`@db.Decimal(10, 2)`|-|`NULL`|
|`@db.Decimal(10, 2)`|-|`NULL`|
|`@default(OPEN)`|-|`OPEN`|
|`@db.Text`|-|`NULL`|
|`@id @default(uuid())`|**`PK`**|`uuid()`|
|`@unique`|**UK**|`-`|
|`-`|-|`-`|
|`@unique`|**UK**|`-`|
|`-`|-|`NULL`|
|`@default(ACTIVE)`|-|`ACTIVE`|
|`@default(now())`|-|`now()`|



|`@id @default(uuid())`|**`PK`**|`uuid()`|
|---|---|---|
|`-`|-|`-`|
|`-`|-|`-`|
|`-`|-|`NULL`|
|`-`|-|`NULL`|
|`@db.Decimal(14, 2)`|-|`-`|
|`@default(true)`|-|`true`|
|`@id @default(uuid())`|**`PK`**|`uuid()`|
|`@relation(fields: [memberId], refer`|**`FK`**|`-`|
|`@relation(fields: [packageId], refe`|**`FK`**|`-`|
|`-`|-|`-`|
|`-`|-|`NULL`|
|`-`|-|`NULL`|
|`@default(ACTIVE)`|-|`ACTIVE`|
|`@default(now())`|-|`now()`|
|`@id @default(uuid())`|**`PK`**|`uuid()`|
|`@relation(fields: [memberId], refer`|**`FK`**|`-`|
|`@relation(fields: [memberPackageId]`|**`FK`**|`NULL`|
|`@relation(fields: [checkedInById],`|**`FK`**|`-`|
|`@default(now())`|-|`now()`|
|`@id @default(uuid())`|**`PK`**|`uuid()`|
|`-`|-|`-`|
|`-`|-|`-`|
|`@default(0) @db.Decimal(5, 2)`|-|`0.00`|
|`@default(true)`|-|`true`|
|`@id @default(uuid())`|**`PK`**|`uuid()`|
|`@relation(fields: [memberId], refer`|**`FK`**|`-`|
|`@relation(fields: [trainerId], refe`|**`FK`**|`-`|
|`@relation(fields: [memberPackageId]`|**`FK`**|`-`|
|`@default(now())`|-|`now()`|



|`@db.Text`|-|`NULL`|
|---|---|---|
|`@id @default(uuid())`|**`PK`**|`uuid()`|
|`@unique`|**UK**|`NULL`|
|`-`|-|`-`|
|`@db.Decimal(14, 2)`|-|`-`|
|`@default(0)`|-|`0`|
|`@default(true)`|-|`true`|
|`@id @default(uuid())`|**`PK`**|`uuid()`|
|`@unique`|**UK**|`-`|
|`@relation(fields: [shiftId], refere`|**`FK`**|`-`|
|`@relation(fields: [cashierId], refe`|**`FK`**|`-`|
|`@relation(fields: [memberId], refer`|**`FK`**|`NULL`|
|`@db.Decimal(14, 2)`|-|`-`|
|`@default(0) @db.Decimal(14, 2)`|-|`0.00`|
|`@db.Decimal(14, 2)`|-|`-`|
|`@default(LAK)`|-|`LAK`|
|`@default(1) @db.Decimal(12, 4)`|-|`1.0000`|
|`@db.Decimal(14, 2)`|-|`-`|
|`@default(0) @db.Decimal(14, 2)`|-|`0.00`|
|`-`|-|`-`|
|`-`|-|`NULL`|
|`@default(now())`|-|`now()`|
|`@id @default(uuid())`|**`PK`**|`uuid()`|
|`@relation(fields: [orderId], refere`|**`FK`**|`-`|
|`-`|-|`-`|
|`-`|-|`NULL`|
|`@relation(fields: [productId], refe`|**`FK`**|`NULL`|
|`@default(1)`|-|`1`|
|`@db.Decimal(14, 2)`|-|`-`|
|`@db.Decimal(14, 2)`|-|`-`|



|ຄໍາອະທິບາຍໍິ**(Description Lao)**|
|---|
|ລະຫັດປະຈໍາຕົວຜູ້ໃຊ້ລະບົບ<br>ຼຸັ|
|ຊ ແລະ ນາມສະກຼຸນ ພະນັກງານ|
|ເບ ໂທລະສັບສໍາລັບເຂົ້າສູື່ລະບົບ|
|ລະຫັດຜື່ານທ<br>ເຂົ້າລະຫັດແລ້ວ|
|ສິດການນໍາໃຊ້ລະບົບ|
|ວັນທ<br>-ເວລາ ສ້າງບັນຊຜູ້ໃຊ|
|ລະຫັດຮອບຜຽນເຮັດວຽກ|
|ລະຫັດພະນັກງານຜູ້ເປ<br>ດຜຽນ|
|ລະຫັດພະນັກງານຜູ້ປິດຜຽນ|
|ວັນ<sup>-</sup>ເວລາ ເລ ື່ມຕົ້ນເປ<br>ດຜຽນ|
|ວັນ<sup>-</sup>ເວລາ ທ<br>ກົດປິດຜຽນ|
|ເງິນທອນເລ ື່ມຕົ້ນ<sup>(</sup>ກ ບ<sup>- LAK)</sup>|
|ເງິນທອນເລ ື່ມຕົ້ນ<sup>(</sup>ບາດ<sup>- THB)</sup>|
|ເງິນສົດເລ ື່ມຕົ້ນ<sup>(</sup>ໂດລາ<sup>- USD)</sup>|
|ິົ ື່ົ້<br>ເງິນສົດກ ບທ<br>ນັບໄດ້ຕົວຈິງຕອນປິດຜຽນ<br>ເງິນສົດບາດທ<br>ນັບໄດ້ຕົວຈິງຕອນປິດຜຽນ|
|ເງິນສົດໂດລາທ<br>ນັບໄດ້ຕົວຈິງ|
|ສະຖານະຂອງຜຽນ|
|ໝາຍເຫດຕອນປິດຜຽນ<br>ັິ|
|ລະຫັດສະມາຊິກ<sup>(System ID)</sup>|
|ລະຫັດບັດສະມາຊິກ<sup>/</sup>ລະຫັດສະແກນ|
|ຊ ແລະ ນາມສະກຼຸນ ສະມາຊິກ|
|ເບ ໂທລະສັບ<sup>(WhatsApp)</sup>|
|URLຮູບຖື່າຍໜ້າກົງຂອງສະມາຊິກ|
|ສະຖານະສະມາຊິກ|
|ວັນທ<br>ສະໝັກສະມາຊິກຄັ້ງທໍາອິດ|



|ລະຫັດແພັກເກດ|
|---|
|ຊື່ແພັກເກດບໍລິການ|
|ຮູບແບບແພັກເກດ|
|ອາຍຼຸການນໍາໃຊ້<sup>(</sup>ຈໍານວນມ ້<sup>)</sup>|
|ຈໍານວນຄັ້ງທ<br>ຫ ິ້ນໄດ້<sup>/</sup>ຊົື່ວໂມງ<sup>PT</sup>|
|ລາຄາຂາຍມາດຕະຖານ<sup>(</sup>ເງິນກ ບ<sup>- LAK)</sup>|
|ສະຖານະເປ<br>ດຂາຍແພັກເກດ|
|ລະຫັດສັນຍາແພັກເກດ|
|ລະຫັດສະມາຊິກຜູ້ຖສິດ|
|ລະຫັດແພັກເກດທ<br>ຊ|
|ວັນ<sup>-</sup>ເວລາ ເລ ື່ມຕົ້ນນໍາໃຊ|
|ວັນ<sup>-</sup>ເວລາ ທ<br>ໝົດອາຍຼຸສັນຍາ|
|ຈໍານວນຄັ້ງຄົງເຫ  ອທ<br>ຫ ິ້ນໄດ້<br>ສະຖານະແພັກເກດຂອງສະມາຊິກ<br>ວັນ<sup>-</sup>ເວລາ ທ<br>ເຮັດລາຍການຊ<br>ລະຫັດປະຫວັດການເຂົ້າຢິມ<br>ລະຫັດສະມາຊິກທ<br>ມາອອກກໍາລັງກາຍ<br>ລະຫັດແພັກເກດທ<br>ໃຊ້ຕັດສິດ<br>ລະຫັດພະນັກງານທ<br>ກົດຮັບເຊັກອິນ<br>ວັນ<sup>-</sup>ເວລາ ທ<br>ສະແກນເຂົ້າປະຕູ|
|ລະຫັດປະຈໍາຕົວຄູເຝິກ<br>ຼຸ ື່ ິູ້ິ|
|ຊ<sup>-</sup>ນາມສະກຼຸນ<sup>/</sup>ຊື່ຫ ິ້ນຄູເຝິກ|
|ເບ ໂທລະສັບຕິດຕໍື່ຂອງຄູເຝິກ|
|ອັດຕາເປ<br>ເຊັນຄື່າຄອມມິດຊັນ<sup>(%)</sup>|
|ສະຖານະການເຮັດວຽກຂອງຄູເຝິກ<br>ັັ|
|ລະຫັດປະຫວັດການສອນ<sup>PT</sup>|
|ລະຫັດລູກຄ້າທ<br>ຮຽນ<sup>PT</sup>|
|ລະຫັດຄູເຝິກຜູ້ສອນ|
|ລະຫັດແພັກເກດ<sup>PT</sup>ທ<br>ຖກຕັດຊົື່ວໂມງ|
|ວັນ<sup>-</sup>ເວລາ ທ<br>ທໍາການສອນ|



|ບັນທຶກທື່າເຝິກ ຫ ໂປຣແກຣມການສອນ|
|---|
|ລະຫັດປະຈໍາຕົວສິນຄ້າ|
|ລະຫັດບາໂຄດສິນຄ້າສາກົນ|
|ຊື່ສິນຄ້າ<sup>/</sup>ເຄ ື່ອງດ ື່ມ<sup>/</sup>ອຼຸປະກອນ|
|ລາຄາຂາຍຍື່ອຍເປັນເງິນກ ບ<sup>(LAK)</sup>|
|ຈໍານວນສິນຄ້າຄົງເຫ ອໃນສາງ|
|ສະຖານະເປ<br>ດຂາຍສິນຄ້າ|
|ລະຫັດບິນຂາຍ<sup>(System ID)</sup>|
|ເລກທ<br>ໃບຮັບເງິນ<sup>(Running No.)</sup>|
|ລະຫັດຜຽນທ<br>ເປ<br>ດບິນນ ້|
|ລະຫັດພະນັກງານຜູ້ຮັບເງິນ|
|ລະຫັດສະມາຊິກທ<br>ຊ້<sup>(Optional)</sup>|
|ຍອດລວມກື່ອນຫັກສື່ວນຫ ຼຸດ<sup>(LAK)</sup><br>ມູນຄື່າສື່ວນຫ ຼຸດໂປຣໂມຊັນ<sup>(LAK)</sup>|
|ຍອດສຼຸດທິທ<br>ຕ້ອງຊໍາລະ<sup>(LAK)</sup>|
|ຼຸິ<br>ສະກຼຸນເງິນທ<br>ຈື່າຍຕົວຈິງ<br>ອັດຕາແລກປື່ຽນຕອນເຮັດລາຍການ<br>ຈໍານວນເງິນທ<br>ຮັບມາຕົວຈິງ|
|ເງິນທອນທ<br>ທອນຄ ນໃຫ້ລູກຄ້າ<sup>(</sup>ກ ບ<sup>)</sup>|
|ຊື່ອງທາງການຊໍາລະເງິນ|
|URLຮູບສະລິບໂອນເງິນ|
|ວັນ<sup>-</sup>ເວລາ ທ<br>ອອກບິນສໍາເລັດ|
|ລະຫັດລາຍການໃນບິນ|
|ລະຫັດບິນຫ ັກທ<br>ຜູກຢູື່|
|ປະເພດລາຍການສິນຄ້າ|
|ລະຫັດແພັກເກດ<sup>(</sup>ຖ້າແມື່ນ<sup>PACKAGE)</sup>|
|ລະຫັດສິນຄ້າ<sup>(</sup>ຖ້າແມື່ນ<sup>PRODUCT)</sup>|
|້ື່<br>ຈໍານວນທ<br>ຊ|
|ລາຄາຕໍື່ໜື່ວຍຕອນຂາຍ<sup>(LAK)</sup>|
|ຍອດລວມລາຍການນ ້<sup>(LAK)</sup>|



ກ ົ ດເກນທ ຼຸ ລະກ ິ ດ ົຼຸິ **/** ໝາຍເຫດ Primary Key ສ້າງ UUID ອັດຕະໂນມັດ ສະແດງເທິງໜ້າຈໍ ແລະ ໃບຮັບເງິນ ໃຊ້ເປັນ<sup>Username,</sup> ຫ້າມຊໍ້າກັນ ເຂົ້າລະຫັດດ້ວຍ<sup>bcrypt</sup> ຫ<sup>argon2</sup> Enum: ADMIN, CASHIER, TRAINER ເຂດເວລາ ວຽງຈັນ<sup>(UTC+7)</sup> Primary Key FK -> User.id FK -> User.id ອັບເດດຕອນປິດຜຽນ ເລ ື່ມນັບຮອບເງິນໃນລ ້ນຊັກ ບັນທຶກເມ ື່ອມອບ<sup>-</sup> ຮັບຜຽນສໍາເລັດ ເງິນສົດກ ບໃນລ ້ນຊັກກື່ອນຂາຍ ເງິນສົດບາດທຕຽມໄວ້ທອນລູກຄ້າ ເງິນສົດໂດລາໃນລ ້ນຊັກ<sup>(</sup> <u>ຖ້າມ</u><sup>)</sup> ພະນັກງານນັບຕົວຈິງ ເພອທຽບກັບຍອດລະບົບ ພະນັກງານນັບຕົວຈິງສົື່ງຜູ້ຈັດການ ພະນັກງານນັບຕົວຈິງສົື່ງຜູ້ຈັດການ Enum: OPEN, CLOSED ເຊັື່ນ<sup>:</sup> ເງິນເກ ນ<sup>5,000</sup> ກ ບ<sup>,</sup> ເງິນທອນບາດບື່ພ **ໍ** Primary Key ຜູກກັບ<sup>Barcode/QR</sup> ຫ ລະຫັດຫຍໍ້ ສະແດງເທິງໜ້າຈໍຕອນສະແກນເຂົ້າຢິມ ເບ ຫ ັກສໍາລັບຕິດຕໍື່ທາງ<sup>WhatsApp</sup> ສະແດງກວດສອບປ້ອງກັນການໃຊ້ບັດແທນກັນ Enum: ACTIVE, EXPIRED, BLOCKED ສະຖິຕິການເຕບໂຕຂອງຖານລູກຄ້າ 

Primary Key ເຊັື່ນ<sup>: '1</sup> ເດ ອນ ບື່ຈາກັດ **ໍ**<sup>', '10</sup> ຄັ້ງ<sup>', '</sup> ປລາຍວັນ<sup>'</sup> Enum: TIME_BASED, SESSION_BASED, DAY_PASS, <u>PT ONLY</u> ເຊັື່ນ<sup>: 30</sup> ມ ້<sup>, 90</sup> ມ ້<sup>, 365</sup> ມ ້<sup>(NULL</sup> <u>ຖ້າແມື່ນ</u><sup>Day Pass)</sup> ກໍານົດຕົວເລກ ເຊັື່ນ<sup>: 10, 20</sup> ຄັ້ງ<sup>(NULL</sup> <u>ຖ້າແມື່ນບຼຸບເຟ</u><sup>)</sup> ສະກຼຸນເງິນຫ ັກຂອງລະບົບ<sup>(Base Currency)</sup> true = ເປດຂາຍໜ້າຮ້ານ<sup>, false =</sup> ປິດການຂາຍ Primary Key FK -> Member.id FK -> Package.id ວັນທເລ ື່ມນັບສັນຍາ ຄິດໄລື່ຈາກ<sup>startDate + durationDays</sup> ຕັດຫ ຼຸດລົງເທອລະ<sup>1</sup> ຄັ້ງເມ ື່ອເຊັກອິນ Enum: ACTIVE, EXPIRED, DEPLETED, CANCELLED Timestamp ວັນບັນທຶກສັນຍາ Primary Key FK -> Member.id FK -> MemberPackage.id (NULL ຖ້າແມື່ນ Day Pass) FK -> User.id ໃຊ້ອະນາໄລຊື່ວງໂມງຄົນແໜ້ນ<sup>(Peak Hours)</sup> Primary Key ສະແດງໃນຕາຕະລາງນັດ ແລະ ເລ ອກຄູເຝິກ ເບ ໂທລະສັບ<sup>WhatsApp</sup> ເຊັື່ນ<sup>: 30.00</sup> ໝາຍເຖິງໄດ້<sup>30%</sup> ຂອງຄື່າຊົື່ວໂມງ true = ຍັງສອນຢູື່, false = ລາອອກ/ພັກວຽກ Primary Key FK -> Member.id FK -> Trainer.id FK -> MemberPackage.id ເວລາຕັດຮອບການສອນຕົວຈິງ 

ເຊັື່ນ<sup>: Chest day, Cardio 30 mins, Bench press 60kg</sup> Primary Key 

ໃຊ້ສະແກນຍິງຂາຍໜ້າຮ້ານໄດ້ທັນທ ເຊັື່ນ<sup>:</sup> ນໍ້າດ ື່ມຫົວສິງ<sup>600ml,</sup> ເວໂປຣຕນ<sup>,</sup> ສາຍຮັດຂໍ້ມ ລາຄາມາດຕະຖານໜ້າຮ້ານ ຕັດສະຕັອກທັນທເມ ື່ອມ ການເປດບິນ true = ມ ຂາຍ, false = ເຊົາຂາຍ/ຢຼຸດນໍາເຂົ້າ 

Primary Key 

Format: INV-YYYYMM-XXXX ເຊັື່ນ: INV-202609-0001 FK -> Shift.id ເພອໃຊ້ສະຫ ຼຸບຍອດຜຽນ FK -> User.id 

FK -> Member.id ຫວື່າງໄວ້ໄດ້ຖ້າແມື່ນ Walk-in ຄິດໄລື່ຖານສະກຼຸນເງິນກ ບ ສື່ວນຫ ຼຸດການຄ້າ subtotalLak - discountLak Enum: LAK (ກ ບ), THB (ບາດ), USD (ໂດລາ) ຕົວຄູນທຽບກັບກ ບ ເຊັື່ນ<sup>: 1 THB = 625 LAK</sup> 

ຕາມສະກຼຸນເງິນ<sup>paidCurrency</sup> ເຊັື່ນ<sup>:</sup> ຮັບໃບ<sup>500</sup> ບາດ ໃນລາວທອນເປັນເງິນກ ບສະເໝ Enum: CASH, BCEL_ONE_QR, BANK_TRANSFER ເກັບຮູບຫ ັກຖານການໂອນເພອກວດສອບຍ້ອນຫ ັງ ເວລາເຮັດທຼຸລະກໍາສໍາເລັດ Primary Key 

FK -> Order.id (onDelete: Cascade) 

Enum: PACKAGE, PRODUCT FK -> Package.id 

FK -> Product.id 

ຈໍານວນໜື່ວຍ ຫ ຈໍານວນແພັກເກດ 

Snapshot ລາຄາປ້ອງກັນການປື່ຽນແປງພາຍຫ ັງ quantity * unitPriceLak 

# ຕາຕະລາງຄ ື່ າຄ ົ ງທໃນ ື່ົ **Prisma (Prisma Enums)** 

ນິຍາມ _enum_ ື່ທປະກາດໃນ _schema.prisma_ 

|ຊື່ື່**Prisma Enum**|ຄື່າສະມາຊິກື່ິ**Enum (Value**|ຊື່ສະແດງຜົນື່ົ**(Display Label LA)**|
|---|---|---|
|**Role**|`ADMIN`|ຜູ້ເບິື່ງແຍງລະບົບູ້ິື່ົ**/**ເຈົ້າຂອງຢິມ|
|**Role**|`CASHIER`|ພະນັກງານຕ້ອນຮັບັ້ັ**/**ແຄດເຊຍ|
|**Role**|`TRAINER`|ຄູເຝິກູິ**/**ເທຣນເນ|
|**ShiftStatus**|`OPEN`|ຜຽນກໍາລັງເປ<br>ດໃຊ້ງານ|
|**ShiftStatus**|`CLOSED`|ປິດຜຽນສະຫຼຸບຍອດແລ້ວ|
|**MemberStatus**|`ACTIVE`|ສະຖານະປົກກະຕິ|
|**MemberStatus**|`EXPIRED`|ແພັກເກດໝົດອາຍຼຸ|
|**MemberStatus**|`BLOCKED`|ຖ ກລະງັບການນໍາໃຊ້|
|**PackageType**|`TIME_BASED`|ແບບກໍານົດໄລຍະເວລາໍົ**(**ບຼຸບເຟຼຸ**)**|
|**PackageType**|`SESSION_BASED`|ແບບກໍານົດຈໍານວນຄັ້ງໍົໍັ້**(**ຄູປອງູ**)**|
|**PackageType**|`DAY_PASS`|ປ<br> <br>ລາຍວັນ|
|**PackageType**|`PT_ONLY`|ຄອດຮຽນກັບຄູເຝິກສື່ວນຕົວ|
|**MembershipStatus**|`ACTIVE`|ໃຊ້ງານໄດ້|
|**MembershipStatus**|`EXPIRED`|ໝົດອາຍຼຸຕາມມ້|
|**MembershipStatus**|`DEPLETED`|ຄົບຈໍານວນຄັ້ງແລ້ວ|
|**MembershipStatus**|`CANCELLED`|ຍົກເລ ກສັນຍາ|
|**Currency**|`LAK`|ກ ບ**(Lao Kip)**|
|**Currency**|`THB`|ບາດໄທ**(Thai Baht)**|
|**Currency**|`USD`|ໂດລາສະຫະລັດັ**(US Dollar)**|
|**PaymentMethod**|`CASH`|ເງິນສົດ|
|**PaymentMethod**|`BCEL_ONE_QR`|ສະແກນ**LAO QR / BCEL One**|
|**PaymentMethod**|`BANK_TRANSFER`|ໂອນຜື່ານທະນາຄານອື່ນ|
|**ItemType**|`PACKAGE`|ແພັກເກດຢິມັິ**/**ຄອດຮຽນ|
|**ItemType**|`PRODUCT`|ສິນຄ້າໜ້າຮ້ານ|



|ຄໍາອະທິບາຍໍິ ແລະ ບໍລິບົດໍິົ**(Description)**|
|---|
|ສິດສູງສຼຸດ<sup>:</sup>ເບິື່ງລາຍງານ<sup>,</sup>ກວດຍອດລວມ<sup>,</sup>ຕັ້ງຄື່າລາຄາແພັກເກດ ແລະ ຈັດການ<br>~~ພະນ~~ັ~~ກງານ~~|
|ເປ<br>ດ<sup>-</sup>ປິດຜຽນ<sup>,</sup>ເຊັກອິນສະມາຊິກ<sup>,</sup>ເປ<br>ດບິນຂາຍແພັກເກດ ແລະ ສິນຄ້າມິນິບາ|
|ເບິື່ງລາຍຊື່ລູກຄ້າທ<br>ສອນ<sup>,</sup>ເຊັກອິນຕັດຊົື່ວໂມງ<sup>PT</sup>ແລະ ເບິື່ງສະຖິຕິຄື່າຄອມມິດຊັນຕົນເອງ|
|ລ ້ນຊັກກໍາລັງຮັບເງິນ<sup>,</sup>ມ ລາຍການຂາຍໃນລະບົບ|
|ນັບເງິນສົດ<sup>3</sup>ສະກຼຸນຄົບຖ້ວນ<sup>,</sup>ລັອກຜຽນບໍື່ໃຫ້ແກ້ໄຂບິນຍ້ອນຫ ັງ<br>ສະມາຊິກມ ປະຫວັດປົກກະຕິ<sup>,</sup>ສາມາດເຂົ້າໃຊ້ບໍລິການໄດ້ຖ້າມ ແພັກເກດທ<br>ຍັງບໍື່ໝົດອາຍຼຸ<br>ສະມາຊິກບໍື່ມ ແພັກເກດທ<br>ໃຊ້ໄດ້<sup>,</sup>ຕ້ອງຕໍື່ອາຍຼຸ ຫ ຊ້ປ<br>ລາຍວັນ<sup>(Day Pass)</sup>|
|ຖກໂຈະຍ້ອນຜິດກົດລະບຽບຢິມ ຫ ຕິດໜ<br>ຄື່າບໍລິການ|
|ເຂົ້າຫ ິ້ນໄດ້ບໍື່ຈໍາກັດຈໍານວນຄັ້ງຈົນກວື່າຈະຮອດມ ້ໝົດອາຍຼຸ<sup>(</sup>ເຊັື່ນ<sup>: 1</sup>ເດ ອນ<sup>, 1</sup>ປ<br>)<br>ເຂົ້າຫ ິ້ນໄດ້ຕາມຈໍານວນຄັ້ງທ<br>ກໍານົດ ເຊັື່ນ<sup>:</sup>ຊ້<sup>10</sup>ຄັ້ງ ພາຍໃນ<sup>60</sup>ມ ້|
|ເຂົ້າຫ ິ້ນໄດ້ສະເພາະມ ້ທ<br>ຊ້ເທົື່ານັ້ນ ເໝາະສໍາລັບລູກຄ້າທົື່ວໄປ<sup>/ Walk-in</sup>|
|ຊົື່ວໂມງຮຽນກັບເທຣນເນ ສື່ວນຕົວ<sup>(</sup>ຕັດຮອບຕາມການສອນຕົວຈິງ<sup>)</sup>|
|ແພັກເກດຍັງຢູື່ໃນກໍານົດເວລາ ແລະ ຍັງມ ສິດຄົງເຫ  ອ|
|ກາຍກໍານົດວັນທ<br>ສິ້ນສຼຸດສັນຍາ<sup>(expireDate)</sup>|
|ຈໍານວນຄັ້ງ<sup>remainingSessions</sup>ກາຍເປັນ<sup>0</sup>|
|ລູກຄ້າຍົກເລ ກ ຫ ຂໍຄ ນເງິນ|
|ສະກຼຸນເງິນຫ ັກ<sup>(Base Currency)</sup>ສໍາລັບຕັ້ງລາຄາ ແລະ ເຮັດບັນຊ|
|ສະກຼຸນເງິນທ<br>ລູກຄ້ານິຍົມຈື່າຍເງິນສົດໃນລາວ<sup>(</sup>ແປງດ້ວຍ<sup>exchangeRate)</sup>|
|ສະກຼຸນເງິນສາກົນ ຮອງຮັບລູກຄ້າຕື່າງປະເທດ ຫ ຄອດລາຄາສູງ|
|ຮັບເງິນສົດ<sup>(</sup>ກ ບ<sup>,</sup>ບາດ<sup>,</sup>ໂດລາ<sup>)</sup>ມ ການຄິດໄລື່ເງິນທອນເປັນກ ບ|
|ສະແກນຈື່າຍຜື່ານແອັບ<sup>OnePay</sup>ຂອງທະນາຄານການຄ້າຕື່າງປະເທດລາວ|
|ໂອນເງິນຜື່ານ<sup>LDB, JDB</sup>ຫ ບັນຊທະນາຄານອ ື່ນໆ|
|ຄື່າສະມາຊິກ<sup>,</sup>ປ<br>ລາຍວັນ ຫ ຄອດຮຽນກັບຄູເຝິກ|
|ນໍ້າດ ື່ມ<sup>,</sup>ເຄ ື່ອງດ ື່ມເກ ອແຮື່<sup>,</sup>ເວໂປຣຕ<br>ນ<sup>,</sup>ອຼຸປະກອນຟິດເນັດ|



