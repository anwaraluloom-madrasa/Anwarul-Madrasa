"use client";

import { useState, useEffect } from "react";
import { IftahQuestionApi, IftahApi } from "@/lib/api";
import { endpoints } from "@/lib/config";
import { useToast } from "@/components/Toast";
import { FiX, FiUser, FiMail, FiPhone, FiMessageSquare, FiSend, FiTag, FiBook } from "react-icons/fi";

interface IftahQuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Tag {
  id: number;
  name: string;
  subcategories?: SubCategory[];
}

interface SubCategory {
  id: number;
  name: string;
  tagId?: number;
}

export default function IftahQuestionForm({ isOpen, onClose }: IftahQuestionFormProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    question: "",
    tagId: "",
    iftah_sub_category_id: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    question: "",
    tagId: "",
    iftah_sub_category_id: "",
  });

  // کله چې فورمه خلاصه شي، د API څخه ټیګونه او فرعي کټګورۍ را واخله
  useEffect(() => {
    if (isOpen) {
      const fetchTagsWithSubcategories = async () => {
        try {
          setLoadingTags(true);
          console.log('🏷️ [IFTAH FORM] د API څخه ټیګونه او فرعي کټګورۍ را اخيستل...');
          
          // لومړۍ پړاو: ټول ټیګونه را واخله
          let result = await IftahApi.getTags({ limit: 100 });
          
          // که محلي مسیر ناکام شي، د مستقیم API کال هڅه وکړه
          if (!result.success || !result.data || (Array.isArray(result.data) && result.data.length === 0)) {
            console.log('🔄 [IFTAH FORM] محلي مسیر ناکام شو، د مستقیم API کال هڅه کېږي...');
            try {
              const directResponse = await fetch(`${endpoints.iftahTags}?limit=100`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
                cache: 'no-store'
              });
              
              if (directResponse.ok) {
                const directData = await directResponse.json();
                let tagsArray: any[] = [];
                if (Array.isArray(directData)) {
                  tagsArray = directData;
                } else if (directData.tags && Array.isArray(directData.tags)) {
                  tagsArray = directData.tags;
                } else if (directData.data && Array.isArray(directData.data)) {
                  tagsArray = directData.data;
                }
                
                result = {
                  success: true,
                  data: tagsArray,
                };
              }
            } catch (directError) {
              console.error('❌ [IFTAH FORM] مستقیم API کال هم ناکام شو:', directError);
            }
          }
          
          if (result.success) {
            // د مختلفو ځواب بڼو سمون
            let tagsArray: any[] = [];
            
            if (Array.isArray(result.data)) {
              tagsArray = result.data;
            } else if (result.data && typeof result.data === 'object' && result.data !== null) {
              const dataObj = result.data as any;
              if (dataObj.tags && Array.isArray(dataObj.tags)) {
                tagsArray = dataObj.tags;
                console.log('📊 [IFTAH FORM] د data.tags خاصیت کې ټیګونه وموندل شول');
              } else if (Array.isArray(dataObj.data)) {
                tagsArray = dataObj.data;
                console.log('📊 [IFTAH FORM] د data.data خاصیت کې ټیګونه وموندل شول');
              }
            }
            
            if (tagsArray.length > 0) {
              // ټیګونه بڼه ورکړه
              const formattedTags = tagsArray.map((tag: any) => {
                const tagId = tag.id || tag.tagId || tag.ID;
                const tagName = tag.name || tag.tag_name || tag.title || tag.label || String(tagId || 'نامعلوم');
                
                return {
                  id: Number(tagId) || 0,
                  name: String(tagName).trim(),
                  subcategories: [] as SubCategory[],
                };
              })
              .filter(tag => tag.id > 0 && tag.name)
              .sort((a, b) => a.name.localeCompare(b.name));
              
              console.log(`✅ [IFTAH FORM] ${formattedTags.length} ټیګ(ونه) وموندل شول، فرعي کټګورۍ را اخيستل کېږي...`);
              
              // دوهمه پړاو: د هر ټیګ لپاره فرعي کټګورۍ را واخله
              const tagsWithSubcategories = await Promise.all(
                formattedTags.map(async (tag) => {
                  try {
                    // د ټیګ معلومات را واخله چې د iftah توکو کې فرعي کټګورۍ شاملې دي
                    const tagResult = await IftahApi.getTagById(tag.id);
                    
                    if (tagResult.success && tagResult.data?.data && Array.isArray(tagResult.data.data)) {
                      // د iftah توکو څخه یوازې فرعي کټګورۍ استخراج کړه
                      const subcategoriesMap = new Map<number, SubCategory>();
                      
                      tagResult.data.data.forEach((item: any) => {
                        if (item.iftah_sub_category && item.iftah_sub_category.id) {
                          const subCat = item.iftah_sub_category;
                          if (!subcategoriesMap.has(subCat.id)) {
                            subcategoriesMap.set(subCat.id, {
                              id: subCat.id,
                              name: subCat.name || 'نامعلوم',
                              tagId: subCat.tagId || tag.id,
                            });
                          }
                        }
                      });
                      
                      const subcategories = Array.from(subcategoriesMap.values())
                        .sort((a, b) => a.name.localeCompare(b.name));
                      
                      console.log(`   📁 ټیګ "${tag.name}" (ID: ${tag.id}): ${subcategories.length} فرعي کټګوري(ې)`);
                      
                      return {
                        ...tag,
                        subcategories: subcategories.length > 0 ? subcategories : undefined,
                      };
                    }
                  } catch (error) {
                    console.warn(`⚠️ [IFTAH FORM] د ${tag.id} ټیګ لپاره فرعي کټګورۍ را اخيستل ناکام شول:`, error);
                  }
                  
                  return {
                    ...tag,
                    subcategories: undefined, // هیڅ فرعي کټګوري نشته یا خطا
                  };
                })
              );
              
              // فیلتر: یوازې هغه ټیګونه وښایه چې فرعي کټګورۍ لري، یا ټول ټیګونه وښایه خو یوازې که فرعي کټګورۍ شتون ولري
              // د کارونکي غوښتنه پر اساس: "کله چې موږ یو ټیګ لرو مګر هیڅ فرعي کټګوري نه لرو چې په هغه کې نه وښودل شوي"
              // دا معنی: ټول ټیګونه وښایه، خو یوازې که فرعي کټګورۍ شتون ولري د فرعي کټګورۍ ښودل وښایه
              const finalTags = tagsWithSubcategories;
              
              console.log(`✅ [IFTAH FORM] په بریالیتوب سره ${finalTags.length} ټیګ(ونه) د فرعي کټګوریو سره پورته شول`);
              finalTags.forEach((tag) => {
                if (tag.subcategories && tag.subcategories.length > 0) {
                  console.log(`   ✓ ${tag.name} (ID: ${tag.id}): ${tag.subcategories.length} فرعي کټګوري(ې)`);
                } else {
                  console.log(`   ⚠ ${tag.name} (ID: ${tag.id}): هیڅ فرعي کټګوري نشته`);
                }
              });
              
              setTags(finalTags);
            } else {
              console.warn('⚠️ [IFTAH FORM] د API ځواب کې هیڅ ټیګ و نه موندل شو');
              toast.error('کټګورۍ و نه موندل شوې. مهرباني وکړئ وروسته هڅه وکړئ.');
            }
          } else {
            console.error('❌ [IFTAH FORM] د API غوښتنه ناکامه شوه:', result.error);
            toast.error('د کټګوریو پورته کولو کې تېروتنه');
          }
        } catch (error) {
          console.error('❌ [IFTAH FORM] د ټیګونو را اخيستلو کې تېروتنه:', error);
          toast.error('د کټګوریو پورته کولو کې تېروتنه');
        } finally {
          setLoadingTags(false);
        }
      };

      fetchTagsWithSubcategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // کله چې کارونکی لیکل پیل کړي، تېروتنه پاکه کړه
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      question: "",
      tagId: "",
      iftah_sub_category_id: "",
    };

    let isValid = true;

    // د نوم اعتبار څارنه
    if (!formData.name.trim()) {
      newErrors.name = "نوم اړین دی";
      isValid = false;
    }

    // د بریښنالیک اعتبار څارنه
    if (!formData.email.trim()) {
      newErrors.email = "بریښنالیک اړین دی";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "مهرباني وکړئ د معتبر بریښنالیک نوم ولیکئ";
      isValid = false;
    }

    // د پوښتنې اعتبار څارنه
    if (!formData.question.trim()) {
      newErrors.question = "پوښتنه اړینه ده";
      isValid = false;
    } else if (formData.question.trim().length < 10) {
      newErrors.question = "مهرباني وکړئ خپله پوښتنه بشپړه توضیح کړئ";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("مهرباني وکړئ ټول اړین ساحې ډک کړئ");
      return;
    }

    setLoading(true);

    try {
      // د tagId او iftah_sub_category_id سره د سپارنې بارچی چمتو کړه که انتخاب شوي وي
      const submissionPayload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        whatsapp: formData.whatsapp || undefined,
        question: formData.question,
      };
      
      // که tagId انتخاب شوی وي، شامل کړه
      if (formData.tagId && formData.tagId.trim()) {
        submissionPayload.tagId = Number(formData.tagId);
        console.log('🏷️ [IFTAH FORM] د tagId شاملول:', submissionPayload.tagId);
      }
      
      // که iftah_sub_category_id انتخاب شوی وي، شامل کړه
      if (formData.iftah_sub_category_id && formData.iftah_sub_category_id.trim()) {
        submissionPayload.iftah_sub_category_id = Number(formData.iftah_sub_category_id);
        console.log('📁 [IFTAH FORM] د iftah_sub_category_id شاملول:', submissionPayload.iftah_sub_category_id);
      }
      
      console.log('📤 [IFTAH FORM] د سپارنې بارچی:', submissionPayload);
      
      const result = await IftahQuestionApi.submit(submissionPayload);

      if (result.success) {
        toast.success("ستاسو پوښتنه په بریالیتوب سره واستول شوه!");
        // فورمه بیا تنظیم کړه
        setFormData({
          name: "",
          email: "",
          phone: "",
          whatsapp: "",
          question: "",
          tagId: "",
          iftah_sub_category_id: "",
        });
        setErrors({
          name: "",
          email: "",
          phone: "",
          whatsapp: "",
          question: "",
          tagId: "",
          iftah_sub_category_id: "",
        });
        // د بریالیتوب وروسته مودال بند کړه
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const errorMsg = (result as any)?.error || (result as any)?.message || "د پوښتنې د استولو کې تېروتنه";
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error("❌ د پوښتنې د استولو کې تېروتنه:", error);
      console.error("❌ د تېروتنې تفصیلات:", error.details);
      console.error("❌ د تېروتنې حالت:", error.status);
      
      // د تېروتنې پیغام وښایه
      let errorMessage = error.message || "د پوښتنې د استولو کې تېروتنه. مهرباني وکړئ بیا هڅه وکړئ.";
      
      if (error.status === 500) {
        // د غوره ټیګ او فرعي کټګورۍ نومونه د غوره تېروتنې پیغامونو لپاره واخله
        const selectedTag = tags.find(tag => String(tag.id) === formData.tagId);
        const selectedSubCategory = selectedTag?.subcategories?.find(sub => String(sub.id) === formData.iftah_sub_category_id);
        
        const tagInfo = selectedTag ? `${selectedTag.name} (ID: ${selectedTag.id})` : (formData.tagId ? `ID: ${formData.tagId}` : '');
        const subCategoryInfo = selectedSubCategory ? `${selectedSubCategory.name} (ID: ${selectedSubCategory.id})` : (formData.iftah_sub_category_id ? `ID: ${formData.iftah_sub_category_id}` : '');
        
        if (error.message?.includes("tagId") || error.message?.includes("Column not found")) {
          errorMessage = `د ډیټابیس تېروتنه: د iftah_questions جدول کې tagId ستون نشته. ${tagInfo ? `غوره شوې کټګوري: ${tagInfo}. ` : ''}مهرباني وکړئ د سیسټم مدیر ته خبر ورکړئ.`;
        } else if (error.message?.includes("iftah_sub_category_id")) {
          errorMessage = `د ډیټابیس تېروتنه: د iftah_questions جدول کې iftah_sub_category_id ستون نشته. ${subCategoryInfo ? `غوره شوې فرعي کټګوري: ${subCategoryInfo}. ` : ''}مهرباني وکړئ د سیسټم مدیر ته خبر ورکړئ.`;
        } else {
          errorMessage = `د سرور تېروتنه (500). ${tagInfo || subCategoryInfo ? `(${tagInfo}${subCategoryInfo ? `, ${subCategoryInfo}` : ''}) ` : ''}مهرباني وکړئ وروسته هڅه وکړئ یا د سیسټم مدیر سره اړیکه ونیسئ.`;
        }
      } else if (error.status === 422) {
        errorMessage = "د استول شویو معلوماتو تېروتنه. مهرباني وکړئ ټول ساحې وګورئ.";
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = "د لاسرسي تېروتنه. مهرباني وکړئ پاڼه تازه کړئ او بیا هڅه وکړئ.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-150" dir="rtl">
        {/* سرلیک */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white p-5 sm:p-6 z-10 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiMessageSquare className="w-5 h-5" />
              </div>
              
            </div>
            <div className="flex-1 flex justify-center items-center px-4">
              <div className="flex items-center gap-2" style={{ marginLeft: 'auto', marginRight: '0' }}>
             
                <p 
                  className="text-base sm:text-lg md:text-xl font-bold text-white/95 leading-tight" 
                  dir="rtl"
                  style={{
                    fontFamily: "'Amiri', 'Noto Sans Arabic', 'Cairo', 'Tajawal', 'Arial', sans-serif",
                    textShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    letterSpacing: '0.05em',
                    textAlign: 'right'
                  }}
                >
                  <span className="font-black" style={{ fontWeight: 900 }}>
                  دَارُ الإِفْتَاء اَنْوَارُ العُلُومِ
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="بندول"
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* د نوم ساحه */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <FiUser className="text-emerald-600 w-3.5 h-3.5" />
              <span>نوم <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="خپل بشپړ نوم ولیکئ"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.name}
              </p>
            )}
          </div>

          {/* د بریښنالیک ساحه */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <FiMail className="text-emerald-600 w-3.5 h-3.5" />
              <span>بریښنالیک <span className="text-red-500">*</span></span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="example@email.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* د ټیګ/کټګورۍ ساحه */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <FiTag className="text-emerald-600 w-3.5 h-3.5" />
              <span>کټګوري <span className="text-gray-400 text-xs">(اختیاري)</span></span>
              {loadingTags && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  پورته کېدل کېږي...
                </span>
              )}
            </label>
            <select
              name="tagId"
              value={formData.tagId}
              onChange={(e) => {
                handleChange(e);
                setFormData(prev => ({ ...prev, iftah_sub_category_id: "" }));
              }}
              disabled={loadingTags}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white appearance-none ${
                errors.tagId ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
              } ${loadingTags ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <option value="" disabled>کټګوري غوره کړئ</option>
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))
              ) : (
                !loadingTags && <option value="" disabled>هیڅ کټګوري و نه موندل شوه</option>
              )}
            </select>
            {errors.tagId && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.tagId}
              </p>
            )}
          </div>

          {/* د فرعي کټګورۍ ساحه - یوازې وښایه که غوره شوی ټیګ فرعي کټګورۍ ولري */}
          {formData.tagId && (() => {
            const selectedTag = tags.find(tag => String(tag.id) === formData.tagId);
            const hasSubcategories = selectedTag?.subcategories && selectedTag.subcategories.length > 0;
            
            if (!hasSubcategories) return null;
            
            return (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
                  <FiTag className="text-teal-600 w-3.5 h-3.5" />
                  <span>فرعي کټګوري <span className="text-gray-400 text-xs">(اختیاري)</span></span>
                </label>
                <select
                  name="iftah_sub_category_id"
                  value={formData.iftah_sub_category_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer ${
                    errors.iftah_sub_category_id ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="" disabled>فرعي کټګوري غوره کړئ</option>
                  {selectedTag.subcategories?.map((subcat) => (
                    <option key={subcat.id} value={subcat.id}>
                      {subcat.name}
                    </option>
                  ))}
                </select>
                {errors.iftah_sub_category_id && (
                  <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.iftah_sub_category_id}
                  </p>
                )}
              </div>
            );
          })()}

          {/* د تلیفون شمېره ساحه */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <FiPhone className="text-amber-600 w-3.5 h-3.5" />
              <span>د تلیفون شمېره <span className="text-gray-400 text-xs">(اختیاري)</span></span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
              placeholder="07X XXX XXXX"
            />
          </div>

          {/* د واتساپ ساحه */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <FiPhone className="text-green-600 w-3.5 h-3.5" />
              <span>واتساپ <span className="text-gray-400 text-xs">(اختیاري)</span></span>
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
              placeholder="07X XXX XXXX"
            />
          </div>

          {/* د پوښتنې ساحه */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <FiMessageSquare className="text-emerald-600 w-3.5 h-3.5" />
              <span>پوښتنه <span className="text-red-500">*</span></span>
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 resize-none bg-gray-50 focus:bg-white ${
                errors.question ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="مهرباني وکړئ خپله شرعي پوښتنه بشپړه او روښانه ولیکئ..."
              required
            />
            {errors.question && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.question}
              </p>
            )}
          </div>

          {/* د سپارنې تڼۍ */}
          <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition-all duration-200"
            >
              لغوه
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>استول کېږي...</span>
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  <span>د پوښتنې استول</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

