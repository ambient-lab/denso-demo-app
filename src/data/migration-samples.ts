export interface MigrationSample {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  legacy: {
    language: string;
    filename: string;
    code: string;
    highlights: string[];
  };
  modern: {
    language: string;
    filename: string;
    code: string;
    highlights: string[];
  };
  features: string[];
  metrics: {
    linesReduced: string;
    performanceGain: string;
    maintainability: string;
  };
}

export const migrationSamples: MigrationSample[] = [
  {
    id: "cobol",
    name: "COBOL/PL-I",
    description: "メインフレーム系バッチ・画面システムからの移行",
    icon: "🏛️",
    color: "#22c55e",
    bgGradient: "from-green-500/20 to-emerald-500/20",
    legacy: {
      language: "cobol",
      filename: "ORDENT01.cbl",
      code: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. ORDENT01.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  WS-ORDER-REC.
           05  WS-ORDER-NO       PIC X(10).
           05  WS-CUST-CODE      PIC X(10).
           05  WS-PROD-CODE      PIC X(15).
           05  WS-QUANTITY       PIC 9(7).
           05  WS-UNIT-PRICE     PIC 9(9)V99.
           05  WS-SUBTOTAL       PIC 9(11)V99.
           05  WS-DISCOUNT-RATE  PIC V99.
           05  WS-DISCOUNT-AMT   PIC 9(9)V99.
           05  WS-TAX-AMT        PIC 9(9)V99.
           05  WS-TOTAL          PIC 9(11)V99.

       PROCEDURE DIVISION.
       MAIN-PROCESS.
           PERFORM INIT-SCREEN.
           PERFORM GET-INPUT UNTIL WS-END-FLAG = 'Y'.
           PERFORM CALC-DISCOUNT.
           PERFORM CALC-TAX.
           PERFORM WRITE-ORDER.
           STOP RUN.

       CALC-DISCOUNT.
           IF WS-SUBTOTAL >= 100000
               MOVE 0.05 TO WS-DISCOUNT-RATE
           ELSE IF WS-SUBTOTAL >= 50000
               MOVE 0.03 TO WS-DISCOUNT-RATE
           ELSE
               MOVE 0 TO WS-DISCOUNT-RATE
           END-IF.
           MULTIPLY WS-SUBTOTAL BY WS-DISCOUNT-RATE
               GIVING WS-DISCOUNT-AMT.

       CALC-TAX.
           SUBTRACT WS-DISCOUNT-AMT FROM WS-SUBTOTAL
               GIVING WS-TAXABLE.
           MULTIPLY WS-TAXABLE BY 0.10
               GIVING WS-TAX-AMT.
           ADD WS-TAXABLE WS-TAX-AMT
               GIVING WS-TOTAL.`,
      highlights: [
        "固定長レコード定義",
        "PERFORM文による制御",
        "COBOL特有の計算構文",
      ],
    },
    modern: {
      language: "typescript",
      filename: "app/orders/new/actions.ts",
      code: `'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// 型安全なバリデーションスキーマ
const OrderSchema = z.object({
  customerCode: z.string().length(10),
  productCode: z.string().length(15),
  quantity: z.number().int().positive(),
});

// 割引計算ロジック
const DISCOUNT_TIERS = [
  { threshold: 100000, rate: 0.05 },
  { threshold: 50000, rate: 0.03 },
  { threshold: 0, rate: 0 },
] as const;

function calculateDiscount(subtotal: number) {
  for (const { threshold, rate } of DISCOUNT_TIERS) {
    if (subtotal >= threshold) {
      return { rate, amount: Math.floor(subtotal * rate) };
    }
  }
  return { rate: 0, amount: 0 };
}

// Server Action
export async function createOrder(formData: FormData) {
  const validated = OrderSchema.parse({
    customerCode: formData.get('customerCode'),
    productCode: formData.get('productCode'),
    quantity: Number(formData.get('quantity')),
  });

  const product = await prisma.product.findUnique({
    where: { code: validated.productCode },
  });

  const subtotal = product!.unitPrice * validated.quantity;
  const { rate, amount: discountAmount } = calculateDiscount(subtotal);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = Math.floor(taxableAmount * 0.10);
  const totalAmount = taxableAmount + taxAmount;

  const order = await prisma.order.create({
    data: {
      ...validated,
      subtotal,
      discountRate: rate,
      discountAmount,
      taxAmount,
      totalAmount,
      status: 'PENDING',
    },
  });

  revalidatePath('/orders');
  return { success: true, orderNumber: order.orderNumber };
}`,
      highlights: [
        "Zod型バリデーション",
        "Server Actions",
        "Prisma ORM",
        "TypeScript型安全性",
      ],
    },
    features: [
      "COBOL固定長 → TypeScript型定義",
      "PERFORM → async/await",
      "EXEC SQL → Prisma ORM",
      "画面I/O → React Server Components",
    ],
    metrics: {
      linesReduced: "60%",
      performanceGain: "10x",
      maintainability: "高",
    },
  },
  {
    id: "java",
    name: "Java/Spring",
    description: "Strutsや独自フレームワークからの移行",
    icon: "☕",
    color: "#f97316",
    bgGradient: "from-orange-500/20 to-amber-500/20",
    legacy: {
      language: "java",
      filename: "OrderController.java",
      code: `@Controller
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerService customerService;

    @RequestMapping(value = "/entry", method = RequestMethod.GET)
    public String showEntryForm(Model model) {
        model.addAttribute("orderForm", new OrderForm());
        return "order/entry";
    }

    @RequestMapping(value = "/entry", method = RequestMethod.POST)
    public String submitOrder(
            @Valid @ModelAttribute("orderForm") OrderForm form,
            BindingResult result,
            Model model,
            HttpSession session) {

        if (result.hasErrors()) {
            return "order/entry";
        }

        // 顧客存在チェック
        Customer customer = customerService
            .findByCode(form.getCustomerCode());
        if (customer == null) {
            result.rejectValue("customerCode",
                "error.notFound", "顧客が見つかりません");
            return "order/entry";
        }

        // 受注登録
        OrderDto orderDto = new OrderDto();
        BeanUtils.copyProperties(form, orderDto);

        try {
            Order order = orderService.createOrder(orderDto);
            session.setAttribute("orderNumber",
                order.getOrderNumber());
            return "redirect:/order/complete";
        } catch (BusinessException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "order/entry";
        }
    }

    @RequestMapping(value = "/complete", method = RequestMethod.GET)
    public String showComplete(Model model, HttpSession session) {
        String orderNumber = (String) session
            .getAttribute("orderNumber");
        model.addAttribute("orderNumber", orderNumber);
        session.removeAttribute("orderNumber");
        return "order/complete";
    }
}`,
      highlights: [
        "@Controllerアノテーション",
        "HttpSession管理",
        "BeanUtils.copyProperties",
        "PRGパターン",
      ],
    },
    modern: {
      language: "typescript",
      filename: "app/orders/new/page.tsx",
      code: `import { createOrder } from './actions';
import { prisma } from '@/lib/prisma';

export default async function OrderEntryPage() {
  const customers = await prisma.customer.findMany({
    select: { code: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">受注登録</h1>

      <form action={createOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            顧客コード
          </label>
          <select
            name="customerCode"
            className="mt-1 block w-full rounded-md border"
            required
          >
            <option value="">選択してください</option>
            {customers.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">
            商品コード
          </label>
          <input
            type="text"
            name="productCode"
            className="mt-1 block w-full rounded-md border"
            required
            maxLength={15}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            数量
          </label>
          <input
            type="number"
            name="quantity"
            className="mt-1 block w-full rounded-md border"
            required
            min={1}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          登録
        </button>
      </form>
    </main>
  );
}`,
      highlights: [
        "Server Components",
        "Server Actions",
        "直接DBアクセス",
        "セッション不要",
      ],
    },
    features: [
      "@Controller → Server Components",
      "HttpSession → Server State",
      "JSP/Thymeleaf → React",
      "BeanUtils → TypeScript型",
    ],
    metrics: {
      linesReduced: "45%",
      performanceGain: "5x",
      maintainability: "高",
    },
  },
  {
    id: "vbnet",
    name: "VB/.NET",
    description: "Windows Forms/WebFormsからの移行",
    icon: "🪟",
    color: "#a855f7",
    bgGradient: "from-purple-500/20 to-violet-500/20",
    legacy: {
      language: "vb",
      filename: "frmOrderEntry.vb",
      code: `Public Class frmOrderEntry
    Inherits System.Windows.Forms.Form

    Private _orderService As OrderService
    Private _customerService As CustomerService

    Private Sub frmOrderEntry_Load(sender As Object, e As EventArgs) _
            Handles MyBase.Load
        ' コンボボックス初期化
        LoadCustomerCombo()
        LoadProductCombo()
        ClearForm()
    End Sub

    Private Sub LoadCustomerCombo()
        Dim customers = _customerService.GetAllCustomers()
        cmbCustomer.DataSource = customers
        cmbCustomer.DisplayMember = "Name"
        cmbCustomer.ValueMember = "Code"
    End Sub

    Private Sub btnRegister_Click(sender As Object, e As EventArgs) _
            Handles btnRegister.Click
        ' 入力チェック
        If Not ValidateInput() Then
            Return
        End If

        Try
            Dim order As New OrderDto()
            order.CustomerCode = cmbCustomer.SelectedValue.ToString()
            order.ProductCode = cmbProduct.SelectedValue.ToString()
            order.Quantity = CInt(txtQuantity.Text)
            order.DeliveryDate = dtpDelivery.Value

            ' 登録処理
            Dim result = _orderService.CreateOrder(order)

            MessageBox.Show($"受注番号: {result.OrderNumber} で登録しました",
                "登録完了", MessageBoxButtons.OK,
                MessageBoxIcon.Information)

            ClearForm()

        Catch ex As BusinessException
            MessageBox.Show(ex.Message, "エラー",
                MessageBoxButtons.OK, MessageBoxIcon.Error)
        End Try
    End Sub

    Private Function ValidateInput() As Boolean
        If cmbCustomer.SelectedIndex < 0 Then
            MessageBox.Show("顧客を選択してください")
            cmbCustomer.Focus()
            Return False
        End If

        If String.IsNullOrEmpty(txtQuantity.Text) Then
            MessageBox.Show("数量を入力してください")
            txtQuantity.Focus()
            Return False
        End If

        Return True
    End Function
End Class`,
      highlights: [
        "Windows Forms",
        "イベントハンドラ",
        "MessageBox",
        "手動バリデーション",
      ],
    },
    modern: {
      language: "typescript",
      filename: "app/orders/new/OrderForm.tsx",
      code: `'use client';

import { useActionState } from 'react';
import { createOrder } from './actions';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-6 py-2 rounded
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? '登録中...' : '登録'}
    </button>
  );
}

export function OrderForm({
  customers,
  products
}: {
  customers: { code: string; name: string }[];
  products: { code: string; name: string }[];
}) {
  const [state, formAction] = useActionState(createOrder, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-100 border border-red-400
                        text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-green-100 border border-green-400
                        text-green-700 px-4 py-3 rounded">
          受注番号: {state.orderNumber} で登録しました
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">
          顧客
        </label>
        <select
          name="customerCode"
          className="mt-1 block w-full rounded-md border p-2"
          required
        >
          <option value="">選択してください</option>
          {customers.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">
          商品
        </label>
        <select
          name="productCode"
          className="mt-1 block w-full rounded-md border p-2"
          required
        >
          <option value="">選択してください</option>
          {products.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">
          数量
        </label>
        <input
          type="number"
          name="quantity"
          min={1}
          required
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>

      <SubmitButton />
    </form>
  );
}`,
      highlights: [
        "useActionState",
        "useFormStatus",
        "宣言的UI",
        "HTML5バリデーション",
      ],
    },
    features: [
      "Windows Forms → React Components",
      "MessageBox → Toast/Alert",
      "イベントハンドラ → Server Actions",
      "DataBinding → React State",
    ],
    metrics: {
      linesReduced: "40%",
      performanceGain: "3x",
      maintainability: "高",
    },
  },
  {
    id: "outsystems",
    name: "OutSystems",
    description: "ローコードプラットフォームからの移行",
    icon: "🔴",
    color: "#ef4444",
    bgGradient: "from-red-500/20 to-rose-500/20",
    legacy: {
      language: "xml",
      filename: "OrderEntry.oml (概念図)",
      code: `<!-- OutSystems Screen Definition (概念) -->
<Screen Name="OrderEntry">
  <Preparation>
    <Aggregate Name="GetCustomers">
      <Source Entity="Customer"/>
      <Filter Condition="Customer.IsActive = True"/>
    </Aggregate>
    <Aggregate Name="GetProducts">
      <Source Entity="Product"/>
    </Aggregate>
  </Preparation>

  <Content>
    <Form Name="OrderForm">
      <Variable Name="OrderRecord" Type="Order"/>

      <Dropdown
        Name="CustomerDropdown"
        Source="GetCustomers.List"
        Value="OrderRecord.CustomerId"
        Label="顧客"/>

      <Dropdown
        Name="ProductDropdown"
        Source="GetProducts.List"
        Value="OrderRecord.ProductId"
        Label="商品"/>

      <Input
        Name="QuantityInput"
        Variable="OrderRecord.Quantity"
        Type="Integer"
        Mandatory="True"
        Label="数量"/>

      <Button
        Name="SubmitButton"
        Label="登録"
        OnClick="SubmitOrder"/>
    </Form>
  </Content>

  <Actions>
    <ServerAction Name="SubmitOrder">
      <Input Parameter="OrderRecord"/>
      <CreateOrder Entity="Order" Source="OrderRecord"/>
      <Feedback Message="登録が完了しました" Type="Success"/>
      <Redirect Screen="OrderList"/>
    </ServerAction>
  </Actions>
</Screen>`,
      highlights: [
        "Aggregate (データ取得)",
        "Screen定義",
        "ServerAction",
        "ビジュアル開発",
      ],
    },
    modern: {
      language: "typescript",
      filename: "app/orders/new/page.tsx",
      code: `import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { OrderForm } from './OrderForm';
import { OrderFormSkeleton } from './OrderFormSkeleton';

// Aggregateに相当するデータ取得
async function getFormData() {
  const [customers, products] = await Promise.all([
    prisma.customer.findMany({
      where: { isActive: true },
      select: { id: true, code: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.product.findMany({
      select: { id: true, code: true, name: true, unitPrice: true },
      orderBy: { name: 'asc' },
    }),
  ]);
  return { customers, products };
}

export default async function OrderEntryPage() {
  const { customers, products } = await getFormData();

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">受注登録</h1>

      <Suspense fallback={<OrderFormSkeleton />}>
        <OrderForm
          customers={customers}
          products={products}
        />
      </Suspense>
    </main>
  );
}

// actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createOrder(
  prevState: unknown,
  formData: FormData
) {
  const customerId = formData.get('customerId') as string;
  const productId = formData.get('productId') as string;
  const quantity = Number(formData.get('quantity'));

  // バリデーション
  if (!customerId || !productId || quantity <= 0) {
    return { error: '入力内容を確認してください' };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  const order = await prisma.order.create({
    data: {
      customerId,
      productId,
      quantity,
      unitPrice: product!.unitPrice,
      totalAmount: product!.unitPrice * quantity,
      status: 'PENDING',
    },
  });

  revalidatePath('/orders');
  redirect(\`/orders/\${order.id}/complete\`);
}`,
      highlights: [
        "Server Components",
        "Suspense境界",
        "Promise.all並列取得",
        "Server Actions",
      ],
    },
    features: [
      "Aggregate → Prisma findMany",
      "Screen → Server Components",
      "ServerAction → Server Actions",
      "Feedback → Toast/Redirect",
    ],
    metrics: {
      linesReduced: "30%",
      performanceGain: "2x",
      maintainability: "高",
    },
  },
  {
    id: "rpg",
    name: "RPG (AS/400)",
    description: "IBM iSeries/AS400システムからの移行",
    icon: "🖥️",
    color: "#3b82f6",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
    legacy: {
      language: "rpg",
      filename: "ORDENT.RPGLE",
      code: `      **FREE
       ctl-opt dftactgrp(*no) actgrp('ORDGRP');

       // ファイル定義
       dcl-f ORDDSP workstn;
       dcl-f ORDMAST disk usage(*update:*output) keyed;
       dcl-f CUSTMAST disk keyed;
       dcl-f PRODMAST disk keyed;

       // 変数定義
       dcl-s wkOrdNo    char(10);
       dcl-s wkCustCd   char(10);
       dcl-s wkProdCd   char(15);
       dcl-s wkQty      packed(7:0);
       dcl-s wkPrice    packed(11:2);
       dcl-s wkSubTotal packed(11:2);
       dcl-s wkDiscount packed(9:2);
       dcl-s wkTax      packed(9:2);
       dcl-s wkTotal    packed(11:2);

       // メイン処理
       dow not *inLR;
         exfmt ORDSCR01;

         if *inKC;  // F3=終了
           leave;
         endif;

         // 入力チェック
         if not validateInput();
           iter;
         endif;

         // 顧客マスタチェック
         chain wkCustCd CUSTMAST;
         if not %found;
           ERRMSG = '顧客が見つかりません';
           iter;
         endif;

         // 商品マスタチェック
         chain wkProdCd PRODMAST;
         if not %found;
           ERRMSG = '商品が見つかりません';
           iter;
         endif;

         // 金額計算
         wkPrice = PMPRICE;
         wkSubTotal = wkPrice * wkQty;

         // 割引計算
         select;
           when wkSubTotal >= 100000;
             wkDiscount = wkSubTotal * 0.05;
           when wkSubTotal >= 50000;
             wkDiscount = wkSubTotal * 0.03;
           other;
             wkDiscount = 0;
         endsl;

         // 税額計算
         wkTax = (wkSubTotal - wkDiscount) * 0.10;
         wkTotal = wkSubTotal - wkDiscount + wkTax;

         // 登録処理
         exec sql
           INSERT INTO ORDMAST
           VALUES(:wkOrdNo, :wkCustCd, :wkProdCd,
                  :wkQty, :wkPrice, :wkTotal, 'P');

       enddo;

       *inLR = *on;`,
      highlights: [
        "RPG/LE Free Format",
        "5250画面 (DSPF)",
        "CHAIN/DOW制御",
        "Packed Decimal",
      ],
    },
    modern: {
      language: "typescript",
      filename: "app/orders/new/page.tsx",
      code: `import { OrderEntryForm } from '@/components/OrderEntryForm';
import { prisma } from '@/lib/prisma';

export default async function OrderEntryPage() {
  // マスタデータ取得 (CUSTMAST, PRODMAST相当)
  const [customers, products] = await Promise.all([
    prisma.customer.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    }),
  ]);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">受注登録</h1>
      <OrderEntryForm
        customers={customers}
        products={products}
      />
    </main>
  );
}

// lib/business-logic/order-calculator.ts
const TAX_RATE = 0.10;

const DISCOUNT_TIERS = [
  { threshold: 100000, rate: 0.05 },
  { threshold: 50000, rate: 0.03 },
] as const;

export function calculateOrderTotals(
  unitPrice: number,
  quantity: number
): OrderTotals {
  const subtotal = unitPrice * quantity;

  // 割引計算 (SELECT...ENDSL相当)
  let discountRate = 0;
  for (const tier of DISCOUNT_TIERS) {
    if (subtotal >= tier.threshold) {
      discountRate = tier.rate;
      break;
    }
  }
  const discountAmount = Math.floor(subtotal * discountRate);

  // 税額計算
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = Math.floor(taxableAmount * TAX_RATE);
  const totalAmount = taxableAmount + taxAmount;

  return {
    subtotal,
    discountRate,
    discountAmount,
    taxableAmount,
    taxAmount,
    totalAmount,
  };
}

// actions.ts (INSERT INTO ORDMAST相当)
'use server';

export async function createOrder(formData: FormData) {
  const data = OrderSchema.parse({
    customerCode: formData.get('customerCode'),
    productCode: formData.get('productCode'),
    quantity: Number(formData.get('quantity')),
  });

  const product = await prisma.product.findUniqueOrThrow({
    where: { code: data.productCode },
  });

  const totals = calculateOrderTotals(
    product.unitPrice,
    data.quantity
  );

  const order = await prisma.order.create({
    data: {
      ...data,
      unitPrice: product.unitPrice,
      ...totals,
      status: 'PENDING',
    },
  });

  revalidatePath('/orders');
  return { success: true, orderNumber: order.orderNumber };
}`,
      highlights: [
        "Server Components",
        "Prisma ORM",
        "純粋関数でロジック分離",
        "Server Actions",
      ],
    },
    features: [
      "5250画面 → React UI",
      "CHAIN → Prisma findUnique",
      "Packed Decimal → number/Decimal.js",
      "EXEC SQL → Prisma create",
    ],
    metrics: {
      linesReduced: "50%",
      performanceGain: "8x",
      maintainability: "高",
    },
  },
];

export const languageColors: Record<string, string> = {
  cobol: "#3b5998",
  java: "#b07219",
  vb: "#945db7",
  xml: "#e34c26",
  rpg: "#2c3e50",
  typescript: "#3178c6",
};
