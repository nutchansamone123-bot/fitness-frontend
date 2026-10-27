# **แผนแม่บทและสเปกระบบฟิตเนสขนาดเล็ก (Micro Fitness Complete Blueprint)** 

สถาปัตยกรรมฉบับสมบูรณ์: NestJS + Prisma (PostgreSQL) + Next.js | 5 Models (รวมระบบรายจ่าย/เงินสดย่อย) | สปป. ลาว 

**Architecture: 5 Core Models Key: Int Autoincrement Petty Cash & Expense Module Multi-Currency (LAK, THB, USD)** 

**LAO QR / BCEL One** 

### **1. บทสรุปสถาปัตยกรรม 5 โมดูลหลัก (Core Architecture & Optimization)** 

ระบบฉบับ **Micro Gym** ออกแบบมาเพื่อยิมขนาดเล็กถึงขนาดกลาง (1 สาขา) ที่ต้องการความคล่องตัวสูงสุด พนักงาน 1 คนดูแลได้ครบทั้งเคาน์เตอร์ โดยใช้ **Int Autoincrement** เป็น Primary Key และเพิ่มโมดูลรายจ่ายหน้าร้านเพื่อให้ยอดเงินสดในลิ้นชักตรงกับระบบ 100%: 

- **✔ โครงสร้าง 5 Models กระชับ:** `User` (พนักงาน), `Package` (แพ็กเกจ), `Member` (สมาชิก), `Payment` (รายรับ), `Expense` (รายจ่ายหน้าร้าน) 

- **✔ เปลี่ยน ID เป็น Int Autoincrement:** ลดการใช้หน่วยความจ�า Index ลงกว่า 50% ค้นหารวดเร็วในเสี้ยววินาที และเชื่อมโยงกับ NestJS `ParseIntPipe` ได้ง่าย 

- **✔ โมดูลรายจ่ายหน้าร้าน (Expense & Petty Cash):** รองรับการหยิบเงินสดจากลิ้นชักไปซื้อน�้าแข็ง, น�้าดื่มสต็อก, น�้ายาท�าความสะอาด พร้อมแนบรูปบิล 

- **✔ การกระทบยอดเงินสดปิดวัน (Daily Cash Reconciliation):** ยอดเงินสดในลิ้นชัก = ยอดรับเงินสด (Cash In) - ยอดรายจ่ายเงินสด (Cash Out) แยก 3 สกุลเงิน 

- **✔ หน้าจอเดียวหน้าเคาน์เตอร์ (Single-Page Counter):** รวม HUD เช็กอิน, Quick POS ขายแพ็กเกจ และปุ่มบันทึกรายจ่ายด่วนไว้ในหน้าเดียว 

หน้า 1 จาก 10 

Micro Fitness POS & Check-in System — Complete Technical Blueprint (สปป. ลาว) 

**2. โครงสร้างฐานข้อมูลฉบับสมบูรณ์ (Prisma Schema - schema.prisma)** 

หน้า 2 จาก 10 

Micro Fitness POS & Check-in System — Complete Technical Blueprint (สปป. ลาว) 

`datasource db { provider = "postgresql" url      = env("DATABASE_URL") } generator client { provider = "prisma-client-js" } enum Role { ADMIN STAFF } enum Currency { LAK THB USD } enum PaymentMethod { CASH BCEL_ONE_QR } enum ExpenseCategory { SUPPLIES       //` น�้าดื่มมาเติม `,` น�้าแข็ง `,` ทิชชู่ `,` น�้ายาท�าความสะอาด `UTILITIES      //` ค่าน�้า `,` ค่าไฟ `,` ค่าเน็ตยิม `MAINTENANCE    //` ซ่อมบ�ารุงอุปกรณ์ช�ารุดด่วน `MISCELLANEOUS  //` ค่าใช้จ่ายเบ็ดเตล็ดอื่นๆ `} // 1.` พนักงาน `/` ผู้จัดการยิม `(Auth & Staff) model User { id           Int       @id @default(autoincrement()) name         String phone        String    @unique passwordHash String role         Role      @default(STAFF) payments     Payment[] expenses     Expense[] } // 2.` แพ็กเกจยิม `(` รายวัน `,` บุฟเฟต์รายเดือน `,` คูปองนับครั้ง `) model Package { id           Int       @id @default(autoincrement()) name         String priceLak     Decimal   @db.Decimal(12, 2) durationDays Int?      //` เช่น `30` วัน `, 365` วัน `(` ตั๋ววันเดียวเป็น `NULL) sessions     Int?      //` เช่น `10` ครั้ง `, 20` ครั้ง `(` บุฟเฟต์เป็น `NULL) members      Member[] } // 3.` สมาชิกยิม และสิทธิ์การเข้าใช้งาน `(Member & Access) model Member { id                Int       @id @default(autoincrement()) code              String    @unique //` รหัสบาร์โค้ด `/ QR /` เบอร์โทร `fullName          String phone             String    @unique //` เบอร์โทรศัพท์ `WhatsApp photoUrl          String?   //` รูปถ่ายหน้าตรงจากกล้อง `Webcam` หน้าร้าน `packageId         Int?      // FK -> Package.id (Int) expireDate        DateTime? //` วันหมดอายุ `(` แพ็กเกจตามวัน `) remainingSessions Int?      @default(0) //` จ�านวนครั้งคงเหลือ `(` แพ็กเกจนับครั้ง `) lastCheckIn       DateTime? //` เวลาเช็กอินล่าสุด `(` ป้องกันสแกนซ�้า `Cooldown 15` นาที `) createdAt         DateTime  @default(now()) package           Package?  @relation(fields: [packageId], references: [id]) payments          Payment[] } // 4.` บันทึกการรับเงินทุกประเภท `(Payments & Multi-Currency) model Payment { id             Int           @id @default(autoincrement()) staffId        Int           // FK -> User.id (Int)` พนักงานผู้รับเงิน `memberId       Int?          // FK -> Member.id (Int)` สมาชิกที่ซื้อ `(Nullable` กรณี `Walk-in)` 

หน้า 3 จาก 10 

Micro Fitness POS & Check-in System — Complete Technical Blueprint (สปป. ลาว) 

`description    String        //` เช่น `"` ต่ออายุ `1` เดือน `", "` ตั๋วรายวัน `Day Pass", "` น�้าดื่ม `2` ขวด `" amountLak      Decimal       @db.Decimal(12, 2) //` ยอดตั้งต้นตามราคากลางเงินกีบ `(Base Amount) paidCurrency   Currency      @default(LAK)      //` สกุลเงินที่จ่ายจริง `(LAK, THB, USD) exchangeRate   Decimal       @default(1) @db.Decimal(10, 2) //` อัตราแลกเปลี่ยน `(` เช่น `1 THB = 625 LAK) amountPaid     Decimal       @db.Decimal(12, 2) //` ยอดเงินที่รับมาจริงตาม `paidCurrency changeLak      Decimal       @default(0) @db.Decimal(12, 2) //` เงินทอนเป็นกีบเสมอ `paymentMethod  PaymentMethod @default(CASH)     // CASH (` เงินสด `)` หรือ `BCEL_ONE_QR (` สแกน `OnePay) createdAt      DateTime      @default(now()) staff          User          @relation(fields: [staffId], references: [id]) member         Member?       @relation(fields: [memberId], references: [id]) } // 5.` บันทึกรายจ่ายหน้าร้านและเงินสดย่อย `(Expense & Petty Cash) model Expense { id           Int             @id @default(autoincrement()) staffId      Int             // FK -> User.id (Int)` พนักงานผู้เบิกเงิน `title        String          //` เช่น `"` ซื้อน�้าแข็ง `2` ถุง `", "` น�้าดื่มหัวสิงห์ `5` โหล `" category     ExpenseCategory @default(SUPPLIES) amountLak    Decimal         @db.Decimal(12, 2) //` มูลค่าเทียบเท่าเงินกีบ `paidCurrency Currency        @default(LAK)      //` สกุลเงินที่จ่ายจริง `(LAK, THB, USD) exchangeRate Decimal         @default(1) @db.Decimal(10, 2) //` อัตราแลกเปลี่ยน `amountPaid   Decimal         @db.Decimal(12, 2) //` จ�านวนเงินที่หยิบออกจากลิ้นชักจริง `receiptUrl   String?         //` รูปถ่ายใบเสร็จ `/` บิลเงินสด `createdAt    DateTime        @default(now()) staff        User            @relation(fields: [staffId], references: [id]) }` 

หน้า 4 จาก 10 

Micro Fitness POS & Check-in System — Complete Technical Blueprint (สปป. ลาว) 

## **3. พจนานุกรมข้อมูล (Data Dictionary - 5 Models)** 

### **3.1 Model: User (ผู้ใช้ระบบ / พนักงาน)** 

|**Field Name**|**Prisma Type**|**Key**|**Attributes**|**ค�ำอธิบำยและกฎทำงธุรกิจ**|
|---|---|---|---|---|
|`id`|Int|**PK**|@id @default(autoincrement())|รหัสประจ�าตัวผู้ใช้ ล�าดับ1, 2, 3...|
|`name`|String|-|-|ชื่อ-นามสกุล พนักงานหรือผู้จัดการ(แสดงบนบิล)|
|`phone`|String|**UK**|@unique|เบอร์โทรศัพท์ ใช้เป็นUsernameล็อกอิน(ห้ามซ�้า)|
|`passwordHash`|String|-|-|รหัสผ่านที่ผ่านการเข้ารหัสHash (bcrypt)|
|`role`|Role|-|@default(STAFF)|ADMIN (เจ้าของ ดูสรุปยอดเงิน) / STAFF (พนักงาน<br>เคาน์เตอร์)|



### **3.2 Model: Package (แพ็กเกจบริการ)** 

|**Field Name**|**Prisma Type**|**Key**|**Attributes**|**ค�ำอธิบำยและกฎทำงธุรกิจ**|
|---|---|---|---|---|
|`id`|Int|**PK**|@id @default(autoincrement())|รหัสแพ็กเกจ ล�าดับ1, 2, 3...|
|`name`|String|-|-|ชื่อแพ็กเกจ เช่น'รายวัน(Day Pass)', 'บุฟเฟต์1<br>เดือน', '10ครั้ง'|
|`priceLak`|Decimal|-|@db.Decimal(12, 2)|ราคาขายมาตรฐานเป็นเงินกีบ(Base Currency)|
|`durationDays`|Int?|-|-|อายุการใช้งาน(วัน)เช่น30วัน, 365วัน(ตั๋ววันเดียว<br>เป็นNULL)|
|`sessions`|Int?|-|-|จ�านวนครั้งที่เข้าได้ เช่น10ครั้ง(บุฟเฟต์เป็นNULL)|



### **3.3 Model: Member (สมาชิกและสิทธิ์การเข้าใช้งาน)** 

|**Field Name**|**Prisma Type**|**Key**|**Attributes**|**ค�ำอธิบำยและกฎทำงธุรกิจ**|
|---|---|---|---|---|
|`id`|Int|**PK**|@id @default(autoincrement())|รหัสสมาชิกในระบบ ล�าดับ1, 2, 3...|
|`code`|String|**UK**|@unique|รหัสสแกนBarcode / QR Codeหรือเบอร์<br>โทรศัพท์(ห้ามซ�้า)|
|`fullName`|String|-|-|ชื่อ-นามสกุล สมาชิก(แสดงผลตัวใหญ่บนจอ<br>HUD)|
|`phone`|String|**UK**|@unique|เบอร์โทรศัพท์WhatsAppรูปแบบสากล(+856<br>20 XXXXXXXX)|
|`photoUrl`|String?|-|-|URLรูปถ่ายหน้าตรงจากกล้องWebcamหน้าร้าน<br>(ป้องกันบัตรวน)|
|`packageId`|Int?|**FK**|@relation(Package)|รหัสแพ็กเกจล่าสุดที่สมาชิกถือครอง(FK-><br>Package.id)|
|`expireDate`|DateTime?|-|-|วันหมดอายุสัญญา(ถ้าถึงวันนี้ ระบบจะแสดงสถานะ<br>สีแดง)|
|`remainingSessions`|Int?|-|@default(0)|จ�านวนครั้งคงเหลือ(ตัดลดทีละ1เมื่อสแกนเช็กอิน<br>ส�าเร็จ)|
|`lastCheckIn`|DateTime?|-|-|เวลาเช็กอินล่าสุด ใช้ระบบAnti-Passbackป้องกัน<br>สแกนซ�้าใน15นาที|



หน้า 5 จาก 10 

Micro Fitness POS & Check-in System — Complete Technical Blueprint (สปป. ลาว) 

### **3.4 Model: Payment (ประวัติการรับช�าระเงินทุกประเภท)** 

|**Field Name**|**Prisma Type**|**Key**|**Attributes**|**ค�ำอธิบำยและกฎทำงธุรกิจ**|
|---|---|---|---|---|
|`id`|Int|**PK**|@id @default(autoincrement())|รหัสบิลช�าระเงิน(Running No.)|
|`staffId`|Int|**FK**|@relation(User)|รหัสพนักงานผู้บันทึกรับเงิน(FK-> User.id)|
|`memberId`|Int?|**FK**|@relation(Member)|รหัสสมาชิกที่ซื้อ(Nullableกรณีลูกค้าจรWalk-in<br>ซื้อน�้าดื่ม)|
|`description`|String|-|-|รายละเอียดรายการขาย เช่น"ต่ออายุ1เดือน", "น�้า<br>ดื่ม2ขวด"|
|`amountLak`|Decimal|-|@db.Decimal(12, 2)|ยอดรวมคิดเป็นเงินกีบตามราคากลาง(Base<br>Amount)|
|`paidCurrency`|Currency|-|@default(LAK)|สกุลเงินที่จ่ายจริง(LAK, THB, USD)|
|`exchangeRate`|Decimal|-|@db.Decimal(10, 2)|อัตราแลกเปลี่ยน ณ เวลาขาย เช่น1 THB = 625<br>LAK|
|`amountPaid`|Decimal|-|@db.Decimal(12, 2)|ยอดเงินที่รับมาจริงตามpaidCurrencyเช่น500<br>บาท|
|`changeLak`|Decimal|-|@default(0)|เงินทอนที่ทอนกลับให้ลูกค้า(ทอนเป็นเงินกีบเสมอ)|
|`paymentMethod`|PaymentMethod|-|@default(CASH)|ช่องทาง: CASH (เงินสด)หรือBCEL_ONE_QR<br>(สแกนOnePay)|
|`createdAt`|DateTime|-|@default(now())|วัน-เวลาท�ารายการ ใช้กรองสรุปยอดขายประจ�าวัน<br>(Daily Sales)|



### **3.5 Model: Expense (บันทึกรายจ่ายหน้าร้านและเงินสดย่อย)** 

|**Field Name**|**Prisma Type**|**Key**|**Attributes**|**ค�ำอธิบำยและกฎทำงธุรกิจ**|
|---|---|---|---|---|
|`id`|Int|**PK**|@id @default(autoincrement())|รหัสรายการรายจ่าย(Running No.)|
|`staffId`|Int|**FK**|@relation(User)|รหัสพนักงานผู้เบิกเงินออกจากลิ้นชัก(FK-><br>User.id)|
|`title`|String|-|-|ชื่อรายการรายจ่าย เช่น"ซื้อน�้าแข็ง2ถุง", "น�้าดื่มหัว<br>สิงห์5โหล"|
|`category`|ExpenseCategory|-|@default(SUPPLIES)|หมวดหมู่: SUPPLIES, UTILITIES,<br>MAINTENANCE, MISCELLANEOUS|
|`amountLak`|Decimal|-|@db.Decimal(12, 2)|มูลค่าเทียบเท่าเงินกีบ ใช้ในการค�านวณกระทบยอด<br>เงินสุทธิ|
|`paidCurrency`|Currency|-|@default(LAK)|สกุลเงินที่หยิบจ่ายจริง(LAK, THB, USD)|
|`exchangeRate`|Decimal|-|@db.Decimal(10, 2)|อัตราแลกเปลี่ยน ณ เวลาจ่ายเงิน|
|`amountPaid`|Decimal|-|@db.Decimal(12, 2)|จ�านวนเงินที่หยิบออกจากลิ้นชักจริงตาม<br>paidCurrency|
|`receiptUrl`|String?|-|-|URLรูปถ่ายบิลเงินสด/ใบเสร็จร้านค้า|
|`createdAt`|DateTime|-|@default(now())|วัน-เวลาที่จ่ายเงิน ใช้สรุปยอดรายจ่ายประจ�าวัน|



หน้า 6 จาก 10 

Micro Fitness POS & Check-in System — Complete Technical Blueprint (สปป. ลาว) 

## **4. การกระทบยอดเงินสด 3 สกุลเงินประจ�าวัน (Daily Cash Reconciliation)** 

**ตรรกะการค�านวณเงินสดคงเหลือสุทธิในลิ้นชัก (Net Drawer Cash Logic)** 

เมื่อสิ้นวัน พนักงานต้องนับเงินสดในลิ้นชัก โดยระบบจะค�านวณยอดคาดหวังแยก 3 สกุลเงินอย่างแม่นย�า: 

   - **$$ ext{Net Cash in Drawer} = \sum ext{Cash In (Payments)} - \sum ext{Cash Out (Expenses)}$$** 

- **เงินสดกีบสุทธิ (Net LAK):** (ยอดขายเงินสดกีบ - เงินทอนกีบทั้งหมด) - ยอดรายจ่ายเงินกีบ 

1. 

- **เงินสดบาทสุทธิ (Net THB):** ยอดขายเงินสดบาท - ยอดรายจ่ายเงินบาท 

2. 

3. **เงินสดดอลลาร์สุทธิ (Net USD):** ยอดขายเงินสดดอลลาร์ - ยอดรายจ่ายเงินดอลลาร์ 

4. **ยอดเงินโอน LAO QR (BCEL One):** แยกออกจากเงินสดในลิ้นชัก น�าไปเทียบกับยอดเงินเข้าใน Statement ธนาคาร 

|**สกุลเงิน**|**ยอดรับเงินสด(Cash In)**|**ยอดจ่ำยออก(Cash Out)**|**ยอดเงินสดที่ต้องเหลือในลิ้นชักจริง**|
|---|---|---|---|
|**LAK (กีบ)**|3,250,000กีบ(หักเงินทอนแล้ว)|-180,000กีบ(ซื้อน�้าแข็ง,น�้าดื่ม)|**3,070,000 กีบ**|
|**THB (บาท)**|1,500บาท|-200บาท(ซื้ออุปกรณ์ช่างด่วน)|**1,300 บาท**|
|**USD (ดอลลาร์)**|50ดอลลาร์|0ดอลลาร์|**50 ดอลลาร์**|
|**BCEL One (LAO QR)**|1,800,000กีบ|0กีบ|**1,800,000 กีบ(ในบัญชีธนาคาร)**|



## **5. สถาปัตยกรรมหน้าจอเดียวหน้าเคาน์เตอร์ (Next.js Single-Page Counter UI)** 

หน้าจอ POS ถูกออกแบบให้พนักงานท�างานได้ครบ 100% ในหน้าเดียว โดยแบ่งเป็น 2 ฝั่งหลัก พร้อมปุ่มเบิกจ่ายเงินสดย่อย: 

**ฝั่งซ้าย: HUD Check-in (ตรวจสิทธิ์รวดเร็ว)** 

- **✔** ช่อง Input ขนาดใหญ่ โฟกัสอัตโนมัติ พร้อมรับสัญญาณยิงสแกน Barcode/QR 

   - ตรวจสอบสิทธิ์และตอบสนองภายในเวลาน้อยกว่า 100ms 

- **✔** 

- **✔ สีเขียว (SUCCESS):** สิทธิ์ผ่าน อายุยังไม่หมด หรือคูปองเหลือ > 2 ครั้ง 

- **✔ สีส้ม (WARNING):** สิทธิ์ใกล้หมดอายุ (เหลือ ≤ 3 วัน หรือคูปอง เหลือ ≤ 2 ครั้ง) 

   - **สีแดง (DENIED):** สิทธิ์หมดอายุแล้ว หรือคูปองหมด 

- **✔** 

- **✔** แสดงรูปถ่ายหน้าตรงขนาดใหญ่เพื่อเทียบตัวบุคคลจริง ป้องกันการ วนบัตร 

### **ฝั่งขวา: Quick POS & Petty Cash** 

- **✔** ปุ่มกดต่ออายุแพ็กเกจด่วน (Day Pass, 1 เดือน, 10 ครั้ง) 

   - ปุ่มขายสินค้ามินิบาร์ด่วน (น�้าดื่ม, เวย์โปรตีน) 

- **✔** 

- **✔ ปุ่ม "+ บันทึกรายจ่าย" (Quick Expense):** เด้ง Pop-up สั้นๆ บันทึก การหยิบเงินสดซื้อของหน้าร้าน 

- **✔** เลือกสกุลเงินที่จ่าย: **LAK / THB / USD** 

- **✔** เลือกช่องทางช�าระ: **เงินสด (Cash)** หรือ **LAO QR (BCEL One)** 

- **✔** ช่องกรอกจ�านวนเงินที่รับมา ➔ ค�านวณเงินทอนกีบแบบ Real-time 

- **✔** สรุปยอดเงินสดคงเหลือในลิ้นชักแบบ Real-time บนแถบด้านบน 

หน้า 7 จาก 10 

Micro Fitness POS & Check-in System — Complete Technical Blueprint (สปป. ลาว) 

## **6. โค้ดตัวอย่างส่วนส�าคัญฝั่ง Backend & Frontend** 

### **6.1 NestJS Expense Service (`expenses.service.ts`)** 

```
@Injectable()
```

`export class ExpensesService { constructor(private readonly prisma: PrismaService) {} async createExpense(dto: CreateExpenseDto) { // 1.` ค�านวณมูลค่าเทียบเท่าเงินกีบ `(Base Currency) const amountLak = dto.amountPaid * dto.exchangeRate; // 2.` บันทึกรายการเบิกจ่ายเงินสดย่อย `return this.prisma.expense.create({ data: { staffId: dto.staffId, title: dto.title, category: dto.category, amountLak: new Decimal(amountLak), paidCurrency: dto.paidCurrency, exchangeRate: new Decimal(dto.exchangeRate), amountPaid: new Decimal(dto.amountPaid), receiptUrl: dto.receiptUrl || null, }, }); } async getTodayExpenses() { const today = new Date(); today.setHours(0, 0, 0, 0); return this.prisma.expense.findMany({ where: { createdAt: { gte: today } }, include: { staff: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, }); } }` 

หน้า 8 จาก 10 

Micro Fitness POS & Check-in System — Complete Technical Blueprint (สปป. ลาว) 

**6.2 NestJS Daily Cash Reconciliation Logic (`reports.service.ts`)** 

```
@Injectable()
```

```
export class ReportsService {
```

```
  constructor(private readonly prisma: PrismaService) {}
```

- `async getDailyCashReconciliation(dateStr?: string) {` 

`const targetDate = dateStr ? new Date(dateStr) : new Date(); const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0)); const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999)); //` ดึงยอดรับเงินสด `(Cash In) const payments = await this.prisma.payment.findMany({ where: { createdAt: { gte: startOfDay, lte: endOfDay } }, });` 

`//` ดึงยอดรายจ่ายเงินสด `(Cash Out) const expenses = await this.prisma.expense.findMany({ where: { createdAt: { gte: startOfDay, lte: endOfDay } }, }); let netCashLak = 0; let netCashThb = 0; let netCashUsd = 0; let bcelOneLak = 0;` 

`for (const p of payments) { if (p.paymentMethod === 'BCEL_ONE_QR') { bcelOneLak += Number(p.amountLak); } else { if (p.paidCurrency === 'LAK') netCashLak += (Number(p.amountPaid) - Number(p.changeLak)); else if (p.paidCurrency === 'THB') { netCashThb += Number(p.amountPaid); netCashLak -= Number(p.changeLak); //` เงินทอนทอนเป็นกีบ `} else if (p.paidCurrency === 'USD') { netCashUsd += Number(p.amountPaid); netCashLak -= Number(p.changeLak); } } }` 

```
    for (const e of expenses) {
      if (e.paidCurrency === 'LAK') netCashLak -= Number(e.amountPaid);
      else if (e.paidCurrency === 'THB') netCashThb -= Number(e.amountPaid);
      else if (e.paidCurrency === 'USD') netCashUsd -= Number(e.amountPaid);
    }
    return { netCashLak, netCashThb, netCashUsd, bcelOneLak, salesCount: payments.length, expenseCount:
expenses.length };
  }

```

หน้า 9 จาก 10 

Micro Fitness POS & Check-in System — Complete Technical Blueprint (สปป. ลาว) 

## **7. การเชื่อมต่อฮาร์ดแวร์และการติดตั้งระบบใช้งานจริง (Hardware & Deployment)** 

|**อุปกรณ์**|**สเปกและพอร์ต**|**ค�ำแนะน�ำกำรตั้งค่ำและแนวทำงปฏิบัติใน สปป. ลำว**|
|---|---|---|
|**เครื่องเคาน์เตอร์**|Mini-PC (Intel N100)หรือLaptop<br>มือสอง|ติดตั้งDockerรันNext.js, NestJSและPostgreSQLภายในเครื่องเดียวบนLocal LAN<br>เพื่อให้ใช้งานได้เสถียรแม้สัญญาณเน็ตหลุด ต่อเข้ากับUPSส�ารองไฟ800VA+ป้องกันไฟดับ|
|**เครื่องสแกนบาร์โค้ด**|1D/2D Barcode & QR Scanner<br>(USB HID)|เสียบใช้งานได้ทันทีแบบPlug & Playไม่ต้องลงไดรเวอร์ ตั้งค่าระบบAnti-Passback<br>ป้องกันการสแกนซ�้าภายใน15นาที|
|**กล้องถ่ายรูปสมาชิก**|Webcam 1080pแบบUSBพร้อมขา<br>ตั้ง|ต่อเข้าBrowserโดยตรงผ่านHTML5 MediaDevices APIถ่ายรูปหน้าตรง300x300px<br>และบันทึกลงระบบทันที|
|**ลิ้นชักเก็บเงินสด**|ลิ้นชักเก็บเงิน4-5ช่องธนบัตร|แยกช่องธนบัตร กีบ(50k/100k),กีบย่อย(10k/20k),บาทไทย และดอลลาร์ เมื่อมีการเบิก<br>เงินซื้อของให้กดบันทึกรายจ่ายทันที|
|**ส�ารองข้อมูล(Backup)**|Cron job + PostgreSQL<br>`pg_dump`|ตั้งScriptดัมป์ฐานข้อมูลทุกเที่ยงคืน บีบอัดเป็น.sql.gzแล้วซิงค์อัตโนมัติขึ้นGoogle<br>DriveหรือCloud Storage|



## **8. แผนงานการพัฒนาและส่งมอบงาน 3 สัปดาห์ (Fast-Track Roadmap)** 

|**สัปดำห์**|**ขอบเขตงำนหลัก**|**ผลงำนที่ส่งมอบ(Key Deliverables & DoD)**|
|---|---|---|
|**สัปดาห์ที่1**|Database & Core Backend API|สร้าง5 ModelsในPrisma (Int Autoincrement), Run Migration,เขียนNestJS 4<br>Modules (Auth, Members, Payments, Expenses)พร้อมระบบTransaction<br>ทดสอบยิงAPIผ่าน100%|
|**สัปดาห์ที่2**|Next.js Single-Page Counter|สร้างหน้าจอเคาน์เตอร์หน้าเดียว(ฝั่งซ้าย: HUDเช็กอิน/ฝั่งขวา: Quick POS +ปุ่มบันทึก<br>รายจ่ายด่วน),เขียนHookดักบาร์โค้ด,เครื่องค�านวณเงินทอน3สกุล,ป็อปอัปแสดงLAO<br>QR (BCEL One)|
|**สัปดาห์ที่3**|Hardware Integration & Go-Live|ทดสอบกับเครื่องยิงBarcode USBและกล้องWebcamหน้าร้านจริง,ทดสอบระบบกระทบ<br>ยอดเงินสดปิดวัน(Net Drawer Cash),ติดตั้งDockerบนเครื่องเคาน์เตอร์,ตั้งระบบ<br>Auto Backupรายวัน,อบรมพนักงาน และเปิดให้บริการจริง|



หน้า 10 จาก 10 

Micro Fitness POS & Check-in System — Complete Technical Blueprint (สปป. ลาว) 

