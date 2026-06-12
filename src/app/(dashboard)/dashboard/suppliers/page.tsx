"use client";

import { useEffect, useState } from "react";
import { Search, Package, MapPin, Star, ExternalLink, Loader2, Edit, Trash2, X, Plus } from "lucide-react";
import { useLanguage } from "@/components/dashboard/language-context";

interface IngredientData {
  id: string;
  name: string;
  category: string;
  unit: string;
  marketPrice: number;
}

interface SupplierData {
  id: string; // supplierName
  name: string;
  category: string;
  province: string;
  products: number;
  rating: number;
  minOrder: string;
  contact: string;
  verified: boolean;
  productListText: string;
  ingredients: IngredientData[];
}

export default function SuppliersPage() {
  const { t } = useLanguage();
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals and Form States
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierData | null>(null);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IngredientData | null>(null);
  
  const [isDeletingSupplierName, setIsDeletingSupplierName] = useState<string | null>(null);
  const [isDeletingProductId, setIsDeletingProductId] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);

  // Form values for Supplier Info
  const [supplierFormValues, setSupplierFormValues] = useState({
    name: "",
    category: "สมุนไพร",
  });

  // Form values for Product Info
  const [productFormValues, setProductFormValues] = useState({
    name: "",
    category: "สมุนไพร",
    unit: "กิโลกรัม",
    marketPrice: "100",
    supplierName: "",
  });

  const categories = ["ทั้งหมด", "สมุนไพร", "น้ำมันหอม", "อุปกรณ์สปา", "ผ้าและเครื่องนุ่งห่ม", "เครื่องเทศ", "อาหาร"];

  const fetchData = () => {
    setLoading(true);
    fetch("/api/dashboard/suppliers")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.ok) {
          setSuppliers(payload.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/dashboard/suppliers")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.ok) {
          setSuppliers(payload.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Supplier handlers
  const handleOpenAddSupplier = () => {
    setSelectedSupplier(null);
    setSupplierFormValues({
      name: "",
      category: "สมุนไพร",
    });
    // For a new supplier, we need at least one initial product/ingredient to save it in DB
    setProductFormValues({
      name: "",
      category: "สมุนไพร",
      unit: "กิโลกรัม",
      marketPrice: "100",
      supplierName: "",
    });
    setIsSupplierModalOpen(true);
  };

  const handleOpenEditSupplier = (s: SupplierData) => {
    setSelectedSupplier(s);
    setSupplierFormValues({
      name: s.name,
      category: s.category,
    });
    setIsSupplierModalOpen(true);
  };

  const handleSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selectedSupplier) {
        // Edit existing supplier (renames all ingredients' supplierName)
        const res = await fetch("/api/dashboard/suppliers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldSupplierName: selectedSupplier.name,
            supplierName: supplierFormValues.name,
          }),
        });
        const result = await res.json();
        if (result.ok) {
          setIsSupplierModalOpen(false);
          fetchData();
        } else {
          alert(result.message || "Failed to edit supplier");
        }
      } else {
        // Create new supplier with first product
        const res = await fetch("/api/dashboard/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: productFormValues.name,
            category: supplierFormValues.category,
            unit: productFormValues.unit,
            marketPrice: productFormValues.marketPrice,
            supplierName: supplierFormValues.name,
          }),
        });
        const result = await res.json();
        if (result.ok) {
          setIsSupplierModalOpen(false);
          fetchData();
        } else {
          alert(result.message || "Failed to create supplier");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSupplier = async (name: string) => {
    try {
      const res = await fetch(`/api/dashboard/suppliers?supplierName=${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.ok) {
        setIsDeletingSupplierName(null);
        fetchData();
      } else {
        alert(result.message || "Failed to delete supplier");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Product handlers
  const handleOpenAddProduct = (s: SupplierData) => {
    setSelectedProduct(null);
    setProductFormValues({
      name: "",
      category: s.category,
      unit: "กิโลกรัม",
      marketPrice: "100",
      supplierName: s.name,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (s: SupplierData, p: IngredientData) => {
    setSelectedProduct(p);
    setProductFormValues({
      name: p.name,
      category: p.category,
      unit: p.unit,
      marketPrice: p.marketPrice?.toString() || "100",
      supplierName: s.name,
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = "/api/dashboard/suppliers";
      const method = selectedProduct ? "PUT" : "POST";
      const payload = selectedProduct
        ? { id: selectedProduct.id, ...productFormValues }
        : productFormValues;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.ok) {
        setIsProductModalOpen(false);
        fetchData();
      } else {
        alert(result.message || "Failed to save product");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/suppliers?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.ok) {
        setIsDeletingProductId(null);
        fetchData();
      } else {
        alert(result.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && suppliers.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D6A4F]" />
      </div>
    );
  }

  const filtered = suppliers.filter(s =>
    (activeCategory === "ทั้งหมด" || s.category === activeCategory) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.province.includes(searchTerm) || s.productListText.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t("วัตถุดิบ & Supplier", "Ingredients & Suppliers")}</h2>
          <p className="text-sm text-slate-500">{t("ค้นหาผู้จำหน่ายวัตถุดิบและอุปกรณ์สปา", "Supplier Marketplace — Find local ingredients & spa equipment suppliers")}</p>
        </div>
        <button
          onClick={handleOpenAddSupplier}
          className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all duration-200 cursor-pointer hover:scale-102 shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("เพิ่มผู้จำหน่าย", "Add Supplier")}
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t("ค้นหาชื่อ supplier หรือวัตถุดิบ...", "Search suppliers or ingredients...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#52B788] transition"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                activeCategory === cat
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "ทั้งหมด" ? t("ทั้งหมด", "All") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Supplier Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#2D6A4F]" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(supplier => (
            <div key={supplier.id} className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-[#52B788]/30 hover:shadow-md">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 shrink-0">
                      <Package className="h-5 w-5 text-[#2D6A4F]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{supplier.name}</h3>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                        <MapPin className="h-3 w-3" />
                        {supplier.province}
                      </div>
                    </div>
                  </div>
                  {supplier.verified && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-[#2D6A4F] shrink-0">Verified</span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                  <span>{supplier.products} {t("รายการ", "items")}</span>
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-[#D4A843] text-[#D4A843]" />
                    {supplier.rating.toFixed(1)}
                  </span>
                  <span>MOQ: {supplier.minOrder}</span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    {supplier.category}
                  </span>
                </div>

                {/* Ingredients details list */}
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-[10px] font-bold text-slate-500 mb-2">{t("รายการสินค้าในระบบ:", "Products in System:")}</p>
                  <div className="space-y-1.5">
                    {supplier.ingredients && supplier.ingredients.map(ing => (
                      <div key={ing.id} className="flex items-center justify-between text-[10px] bg-slate-50 rounded-lg p-2 hover:bg-slate-100/80 transition">
                        <span className="text-slate-700 font-semibold truncate max-w-[150px]">{ing.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-slate-500 font-medium">฿{ing.marketPrice} / {ing.unit}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleOpenEditProduct(supplier, ing)}
                              className="text-slate-400 hover:text-[#2D6A4F] p-0.5 cursor-pointer"
                              title={t("แก้ไขสินค้า", "Edit Product")}
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => setIsDeletingProductId(ing.id)}
                              className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                              title={t("ลบสินค้า", "Delete Product")}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleOpenAddProduct(supplier)}
                    className="mt-2 text-[#2D6A4F] hover:text-[#1B4332] text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    + {t("เพิ่มสินค้าใหม่", "Add Product")}
                  </button>
                </div>
              </div>

              <div className="mt-5 flex gap-2 pt-2">
                <button className="flex-1 rounded-lg bg-[#2D6A4F] py-2 text-xs font-semibold text-white transition hover:bg-[#1B4332]">
                  {t("ติดต่อ", "Contact")}
                </button>
                <button
                  onClick={() => handleOpenEditSupplier(supplier)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-[#2D6A4F] transition cursor-pointer"
                  title={t("แก้ไขผู้จำหน่าย", "Edit Supplier")}
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsDeletingSupplierName(supplier.name)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600 transition cursor-pointer"
                  title={t("ลบผู้จำหน่าย", "Delete Supplier")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Supplier Modal */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {selectedSupplier ? t("แก้ไขข้อมูลผู้จำหน่าย", "Edit Supplier Details") : t("เพิ่มผู้จำหน่ายใหม่", "Add New Supplier")}
              </h3>
              <button onClick={() => setIsSupplierModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSupplierSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">{t("ชื่อผู้จำหน่าย / แหล่งวัตถุดิบ", "Supplier Name")}</label>
                <input
                  type="text"
                  required
                  value={supplierFormValues.name}
                  onChange={e => setSupplierFormValues({ ...supplierFormValues, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                  placeholder="เช่น กลุ่มทอผ้าไหมบ้านโนนเสี้ยว"
                />
              </div>

              {!selectedSupplier && (
                <div className="border border-slate-100 bg-slate-50 rounded-xl p-4 space-y-3">
                  <p className="font-bold text-[#2D6A4F] text-[10px] uppercase tracking-wide">{t("เพิ่มสินค้าชิ้นแรก", "Add First Product")}</p>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">{t("ชื่อสินค้า/วัตถุดิบ", "Product Name")}</label>
                    <input
                      type="text"
                      required
                      value={productFormValues.name}
                      onChange={e => setProductFormValues({ ...productFormValues, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2 bg-white outline-none focus:border-[#52B788] transition text-slate-800"
                      placeholder="เช่น ใบมะกรูดอบแห้ง"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">{t("หมวดหมู่", "Category")}</label>
                      <select
                        value={supplierFormValues.category}
                        onChange={e => setSupplierFormValues({ ...supplierFormValues, category: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2 bg-white outline-none focus:border-[#52B788] transition text-slate-800"
                      >
                        <option value="สมุนไพร">{t("สมุนไพร", "Herbs")}</option>
                        <option value="น้ำมันหอม">{t("น้ำมันหอม", "Aroma")}</option>
                        <option value="อุปกรณ์สปา">{t("อุปกรณ์สปา", "Spa Tools")}</option>
                        <option value="ผ้าและเครื่องนุ่งห่ม">{t("ผ้า/เครื่องแต่งกาย", "Textile")}</option>
                        <option value="เครื่องเทศ">{t("เครื่องเทศ", "Spices")}</option>
                        <option value="อาหาร">{t("อาหาร", "Food")}</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">{t("ราคาตลาด", "Market Price")}</label>
                      <input
                        type="number"
                        required
                        value={productFormValues.marketPrice}
                        onChange={e => setProductFormValues({ ...productFormValues, marketPrice: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2 bg-white outline-none focus:border-[#52B788] transition text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">{t("หน่วย", "Unit")}</label>
                      <input
                        type="text"
                        required
                        value={productFormValues.unit}
                        onChange={e => setProductFormValues({ ...productFormValues, unit: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2 bg-white outline-none focus:border-[#52B788] transition text-slate-800"
                        placeholder="เช่น กิโลกรัม, ขวด"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  {t("ยกเลิก", "Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#2D6A4F] px-4 py-2 hover:bg-[#1B4332] text-white font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                  {t("บันทึก", "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {selectedProduct ? t("แก้ไขข้อมูลสินค้า", "Edit Product Details") : t("เพิ่มสินค้าใหม่", "Add New Product")}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">{t("ชื่อสินค้า/วัตถุดิบ", "Product Name")}</label>
                <input
                  type="text"
                  required
                  value={productFormValues.name}
                  onChange={e => setProductFormValues({ ...productFormValues, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("หมวดหมู่สินค้า", "Category")}</label>
                  <select
                    value={productFormValues.category}
                    onChange={e => setProductFormValues({ ...productFormValues, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800 bg-white"
                  >
                    <option value="สมุนไพร">{t("สมุนไพร", "Herbs")}</option>
                    <option value="น้ำมันหอม">{t("น้ำมันหอม", "Aroma")}</option>
                    <option value="อุปกรณ์สปา">{t("อุปกรณ์สปา", "Spa Tools")}</option>
                    <option value="ผ้าและเครื่องนุ่งห่ม">{t("ผ้าและเครื่องแต่งกาย", "Textile")}</option>
                    <option value="เครื่องเทศ">{t("เครื่องเทศ", "Spices")}</option>
                    <option value="อาหาร">{t("อาหาร", "Food")}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("หน่วยนับ", "Unit")}</label>
                  <input
                    type="text"
                    required
                    value={productFormValues.unit}
                    onChange={e => setProductFormValues({ ...productFormValues, unit: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                    placeholder="เช่น กิโลกรัม, ขวด"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{t("ราคาตลาด (บาท)", "Market Price (THB)")}</label>
                <input
                  type="number"
                  required
                  value={productFormValues.marketPrice}
                  onChange={e => setProductFormValues({ ...productFormValues, marketPrice: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  {t("ยกเลิก", "Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#2D6A4F] px-4 py-2 hover:bg-[#1B4332] text-white font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                  {t("บันทึก", "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Supplier Confirmation */}
      {isDeletingSupplierName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 border border-slate-100 text-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-2">{t("ยืนยันการลบผู้จำหน่าย", "Confirm Deletion")}</h4>
            <p className="text-slate-500 mb-5">{t("คุณต้องการลบข้อมูลผู้จำหน่ายรายนี้พร้อมกับสินค้าทั้งหมดของผู้จำหน่ายรายนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้", "Are you sure you want to delete this supplier and all its associated products? This action cannot be undone.")}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeletingSupplierName(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              >
                {t("ยกเลิก", "Cancel")}
              </button>
              <button
                onClick={() => handleDeleteSupplier(isDeletingSupplierName)}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-white font-semibold transition cursor-pointer"
              >
                {t("ลบออกทั้งหมด", "Delete All")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation */}
      {isDeletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 border border-slate-100 text-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-2">{t("ยืนยันการลบสินค้า", "Confirm Product Deletion")}</h4>
            <p className="text-slate-500 mb-5">{t("คุณแน่ใจว่าต้องการลบสินค้าชิ้นนี้จากระบบใช่หรือไม่?", "Are you sure you want to delete this product from the system?")}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeletingProductId(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              >
                {t("ยกเลิก", "Cancel")}
              </button>
              <button
                onClick={() => handleDeleteProduct(isDeletingProductId)}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-white font-semibold transition cursor-pointer"
              >
                {t("ลบออก", "Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
