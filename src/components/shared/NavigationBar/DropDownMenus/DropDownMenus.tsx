/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import { Menu, MenuItem } from "@/components/ui/navbar-menu";
import ScrollButton from "@/components/ui/ScrollButton/ScrollButton";
import { useGetAllPostsQuery } from "@/redux/features/blog/blogApi";
import { useGetAllBrandsQuery } from "@/redux/features/brand/brandApi";
import { useGetAllNavbarMenusQuery } from "@/redux/features/navbar/navbarApi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FieldValues } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";

interface BrandItem {
  id: number | string;
  title: string;
  imageUrl?: string;
  tagline?: string;
}

interface Brand {
  id: number;
  caption: string;
  list: BrandItem[];
}

interface TopBrand {
  id: number;
  caption: string;
  list: BrandItem[];
}

const DropDownMenus = () => {
  const [active, setActive] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: navbarData } = useGetAllNavbarMenusQuery(undefined);
  const rawNavbarMenus = (navbarData?.data || []) as any[];
  const navbarMenus = useMemo(
    () => rawNavbarMenus.filter((m) => m.isActive !== false),
    [rawNavbarMenus],
  );

  const { data: brandsData } = useGetAllBrandsQuery({});
  const { data: blogsData } = useGetAllPostsQuery({});
  const brandProfiles = useMemo(
    () => (Array.isArray(brandsData) ? brandsData : brandsData?.data || []),
    [brandsData],
  );
  const blogPosts = useMemo(
    () => (Array.isArray(blogsData) ? blogsData : blogsData?.data || []),
    [blogsData],
  );

  const handleSubmit = (data: FieldValues, reset: any) => {
    console.log("Form Data:", data);
    setSearchTerm(data?.search || "");
    // reset(); // Uncomment this line to reset the form after submission
  };

  // search bar end

  const [brandList, setBrandList] = useState<Brand[]>([]);
  const [topBrandListArr, setTopBrandListArr] = useState<BrandItem[]>([]);
  const [FilteredBrandList, setFilteredBrandList] =
    useState<Brand[]>(brandList);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [blogMenuList, setBlogMenuList] = useState<SubMenu[]>([]);
  // const { register, handleSubmit, watch, setValue } = useForm<{ search: string }>();

  // const watchSearch = watch("search");
  const watchSearch = searchTerm;

  useEffect(() => {
    if (watchSearch?.length > 0) {
      const filteredList: Brand[] = [];
      brandList.forEach((brand) => {
        const filteredItems = brand.list.filter((item) =>
          item.title.toLowerCase().includes(watchSearch.toLowerCase()),
        );
        if (filteredItems.length > 0) {
          filteredList.push({ ...brand, list: filteredItems });
        }
      });
      setFilteredBrandList(filteredList);
    } else {
      setFilteredBrandList(brandList);
    }
  }, [watchSearch, brandList]);

  useEffect(() => {
    const activeBrands = brandProfiles.filter(
      (brand: any) => brand.status === "Active",
    ) as any[];
    const groupedBrands = activeBrands
      .reduce<Brand[]>((groups, brand: any) => {
        const caption = brand.name.charAt(0).toUpperCase();
        const existingGroup = groups.find((group) => group.caption === caption);
        const brandItem = {
          id: brand.slug,
          title: brand.name,
          imageUrl: brand.logoUrl,
          tagline: brand.tagline,
        };

        if (existingGroup) {
          existingGroup.list.push(brandItem);
        } else {
          groups.push({
            id: caption.charCodeAt(0),
            caption,
            list: [brandItem],
          });
        }

        return groups;
      }, [])
      .sort((a, b) => a.caption.localeCompare(b.caption));

    setBrandList(groupedBrands);
    setTopBrandListArr(
      activeBrands
        .filter((brand: any) => brand.featured)
        .slice(0, 10)
        .map((brand: any) => ({
          id: brand.slug,
          title: brand.name,
          imageUrl: brand.logoUrl,
          tagline: brand.tagline,
        })),
    );

    const blogCategories = new Map<string, SubMenu>();
    blogPosts
      .filter((post: any) => post.status === "Published")
      .forEach((post: any) => {
        if (!blogCategories.has(post.category)) {
          blogCategories.set(post.category, {
            slug: post.slug,
            subMenuTitle: post.category,
            imageUrl: post.imageUrl,
            descriptions: post.excerpt,
            chieldMenu: [{ chieldMenuTitle: "" }],
          });
        }
      });
    setBlogMenuList(Array.from(blogCategories.values()));
  }, [brandProfiles, blogPosts]);

  const alphabetList = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  interface ChildMenu {
    chieldMenuTitle: string;
  }

  interface SubMenu {
    slug?: string;
    subMenuTitle: string;
    imageUrl: string;
    chieldMenu: ChildMenu[];
    descriptions?: string;
  }

  interface Menu {
    imageUrl: string;
    menu: string;
    subMenu: SubMenu[];
  }

  const fakeData: Menu[] = [
    {
      imageUrl: "https://example.com/images/sunglasses.jpg",
      menu: "Sunglasses",
      subMenu: [
        {
          subMenuTitle: "Men's Sunglasses",
          imageUrl:
            "https://img.freepik.com/premium-photo/confident-young-man-with-stylish-eyeglasses-trendy-green-background_1153477-20408.jpg?w=740",
          chieldMenu: [
            { chieldMenuTitle: "Casual" },
            { chieldMenuTitle: "Sports" },
            { chieldMenuTitle: "Luxury" },
            { chieldMenuTitle: "Polarized" },
          ],
          descriptions: "",
        },
        {
          subMenuTitle: "Women's Sunglasses",
          imageUrl:
            "https://img.freepik.com/premium-photo/woman-wearing-hat-sunglasses-is-posing-photo_1185498-16798.jpg?w=1380",
          chieldMenu: [
            { chieldMenuTitle: "Casual" },
            { chieldMenuTitle: "Luxury" },
            { chieldMenuTitle: "Fashion" },
            { chieldMenuTitle: "Oversized" },
          ],
          descriptions: "",
        },
        {
          subMenuTitle: "Kids' Sunglasses",
          imageUrl:
            "https://img.freepik.com/premium-psd/child-travel-style_510503-155.jpg?w=740",
          chieldMenu: [
            { chieldMenuTitle: "Boys" },
            { chieldMenuTitle: "Girls" },
            { chieldMenuTitle: "Trendy" },
            { chieldMenuTitle: "Protective" },
          ],
          descriptions: "",
        },
        {
          subMenuTitle: "Polarized Sunglasses",
          imageUrl:
            "https://img.freepik.com/premium-photo/product-photography-green-outdoor-sunglass_162944-3148.jpg?w=740",
          chieldMenu: [
            { chieldMenuTitle: "Men's Polarized" },
            { chieldMenuTitle: "Women's Polarized" },
            { chieldMenuTitle: "Sport Polarized" },
            { chieldMenuTitle: "Stylish Polarized" },
          ],
          descriptions: "",
        },
        {
          subMenuTitle: "Aviator Sunglasses",
          imageUrl:
            "https://www.randolphusa.com/cdn/shop/articles/Mr.-Randolph-color_600x600_crop_center.jpg?v=1584122243",
          chieldMenu: [
            { chieldMenuTitle: "Classic Aviator" },
            { chieldMenuTitle: "Modern Aviator" },
            { chieldMenuTitle: "Metal Aviator" },
            { chieldMenuTitle: "Colored Aviator" },
          ],
          descriptions: "",
        },
      ],
    },
    {
      imageUrl: "https://example.com/images/optical-glasses.jpg",
      menu: "Optical Glasses",
      subMenu: [
        {
          subMenuTitle: "Men's Optical Glasses",
          imageUrl:
            "https://img.freepik.com/premium-photo/confident-young-man-with-stylish-eyeglasses-trendy-green-background_1153477-20408.jpg?w=740",
          chieldMenu: [
            { chieldMenuTitle: "Business" },
            { chieldMenuTitle: "Casual" },
            { chieldMenuTitle: "Fashion" },
            { chieldMenuTitle: "Luxury" },
          ],
          descriptions: "",
        },
        {
          subMenuTitle: "Women's Optical Glasses",
          imageUrl:
            "https://img.freepik.com/premium-photo/blond-woman-wearing-glasses-hat-posing-picture-generative-ai_1034973-93773.jpg?w=740",
          chieldMenu: [
            { chieldMenuTitle: "Fashion" },
            { chieldMenuTitle: "Professional" },
            { chieldMenuTitle: "Luxury" },
            { chieldMenuTitle: "Trendy" },
          ],
          descriptions: "",
        },
        {
          subMenuTitle: "Kids' Optical Glasses",
          imageUrl:
            "https://static.zennioptical.com/marketing/category/kids/4tile/4_tile_var_b_1/kids_tlc_4Tile_xs.png",
          chieldMenu: [
            { chieldMenuTitle: "Boys" },
            { chieldMenuTitle: "Girls" },
            { chieldMenuTitle: "Durable" },
            { chieldMenuTitle: "Colorful" },
          ],
          descriptions: "",
        },
        {
          subMenuTitle: "Blue Light Blocking Glasses",
          imageUrl:
            "https://isightinfo.com/wp-content/uploads/2019/02/a-pair-of-blue-light-blocking-glasses-from-kelowna-optometrists-1920x1366.jpeg",
          chieldMenu: [
            { chieldMenuTitle: "Men's Blue Light" },
            { chieldMenuTitle: "Women's Blue Light" },
            { chieldMenuTitle: "Stylish Blue Light" },
            { chieldMenuTitle: "Professional Blue Light" },
          ],
          descriptions: "",
        },
        {
          subMenuTitle: "Progressive Lenses",
          imageUrl:
            "https://i.ebayimg.com/images/g/VkEAAOSwW-xjdlTA/s-l1200.webp",
          chieldMenu: [
            { chieldMenuTitle: "Men's Progressive" },
            { chieldMenuTitle: "Women's Progressive" },
            { chieldMenuTitle: "Bifocal" },
            { chieldMenuTitle: "Photochromic" },
          ],
          descriptions: "",
        },
      ],
    },
    {
      imageUrl: "https://example.com/images/blog.jpg",
      menu: "Blog",
      subMenu: [
        {
          subMenuTitle: "Sunglasses Trends",
          imageUrl:
            "https://www.shopz.com.bd/wp-content/uploads/2022/01/Emosnia-Small-Rectangle-Sunglasses-Men-Women.jpg",
          descriptions:
            "Discover the latest trends in sunglasses fashion for the current year.",
          chieldMenu: [{ chieldMenuTitle: "" }],
        },
        {
          subMenuTitle: "Optical Glasses Care",
          imageUrl:
            "https://raha.com.bd/public/uploads/all/5BmKMNduyhHOsQvZISiWnKXM9LycMWyS0B9eME7a.jpg",
          descriptions:
            "Learn how to take care of your optical glasses to keep them in top condition.",
          chieldMenu: [{ chieldMenuTitle: "" }],
        },
        {
          subMenuTitle: "Health & Vision",
          imageUrl:
            "https://eoms.cutpricebd.com/oms_products/big/164182003637874_27417.png",
          descriptions:
            "Tips and advice on maintaining healthy vision and eye care.",
          chieldMenu: [{ chieldMenuTitle: "" }],
        },
        {
          subMenuTitle: "Brand Spotlights",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREvUxGf1C6Z4xXkvxG0lqvgvdTNvf0R17OvBccRwUSTLHwQyd7QQYGNGnxxpSCAN09vOI&usqp=CAU",
          descriptions:
            "Highlighting the top eyewear brands and their latest collections.",
          chieldMenu: [{ chieldMenuTitle: "" }],
        },
        {
          subMenuTitle: "Customer Stories",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvVM_ki9-mvQORnvC7qApj188IWzvrPkHtpGFakcAbSWZKbsYllOtOX21AxIY8c55UMu0&usqp=CAU",
          descriptions:
            "Read about the experiences and stories from our satisfied customers.",
          chieldMenu: [{ chieldMenuTitle: "" }],
        },
        {
          subMenuTitle: "Tech Insights",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0a6mQf-lrLXZljIPZBbCqi6dYwf1ehST0760WLlzbu6RRKyPHtb-Wb4ddxHLjbIQew-0&usqp=CAU",
          descriptions:
            "Stay updated with the latest technological advancements in eyewear.",
          chieldMenu: [{ chieldMenuTitle: "" }],
        },
        {
          subMenuTitle: "Seasonal Picks",
          imageUrl:
            "https://static-01.daraz.com.bd/p/f612727fc1eb2297d46c27ad371cf08a.jpg_750x750.jpg_.webp",
          descriptions: "Find the best eyewear picks for the current season.",
          chieldMenu: [{ chieldMenuTitle: "" }],
        },
        {
          subMenuTitle: "Travel Essentials",
          imageUrl:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/33eed6d37daf73ed84b0549f7238426d.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp",
          descriptions:
            "Must-have eyewear for travelers, ensuring comfort and protection.",
          chieldMenu: [{ chieldMenuTitle: "" }],
        },
        {
          subMenuTitle: "Style Guides",
          imageUrl:
            "https://www.jiomart.com/images/product/original/rvzeicz9k1/campeon-uv-400-protection-avaitor-black-frame-green-glass-sunglasses-for-men-and-women-pack-of-1-product-images-rvzeicz9k1-6-202202062353.jpg?im=Resize=(500,630)",
          descriptions:
            "Comprehensive guides to help you choose the right style of eyewear.",
          chieldMenu: [{ chieldMenuTitle: "" }],
        },
      ],
    },
    {
      imageUrl: "https://example.com/images/contact-lens.jpg",
      menu: "Contact Lens",
      subMenu: [
        {
          subMenuTitle: "Disposable Lenses",
          imageUrl:
            "https://images.unsplash.com/photo-1516211697506-8360bd773497?w=500&q=80",
          chieldMenu: [
            { chieldMenuTitle: "Daily Disposables" },
            { chieldMenuTitle: "Weekly Disposables" },
            { chieldMenuTitle: "Monthly Disposables" },
          ],
          descriptions:
            "Convenient and hygienic contact lens options for everyday use.",
        },
        {
          subMenuTitle: "Colored Contact Lenses",
          imageUrl:
            "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=500&q=80",
          chieldMenu: [
            { chieldMenuTitle: "Natural Colors" },
            { chieldMenuTitle: "Cosplay Lenses" },
            { chieldMenuTitle: "Prescription Colored" },
          ],
          descriptions:
            "Change your eye color with premium safety approved lenses.",
        },
        {
          subMenuTitle: "Lens Solutions & Care",
          imageUrl:
            "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&q=80",
          chieldMenu: [
            { chieldMenuTitle: "Multi-Purpose Solutions" },
            { chieldMenuTitle: "Travel Packs" },
            { chieldMenuTitle: "Lens Cases" },
          ],
          descriptions:
            "Essential care items to keep your contact lenses safe and sanitized.",
        },
      ],
    },
    {
      imageUrl: "https://example.com/images/accessories.jpg",
      menu: "Accessories",
      subMenu: [
        {
          subMenuTitle: "Storage Cases",
          imageUrl:
            "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&q=80",
          chieldMenu: [
            { chieldMenuTitle: "Hard Cases" },
            { chieldMenuTitle: "Soft Pouches" },
            { chieldMenuTitle: "Double Cases" },
          ],
          descriptions:
            "Protective cases to safeguard your eyewear from scratches and drops.",
        },
        {
          subMenuTitle: "Cleaning Solutions",
          imageUrl:
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80",
          chieldMenu: [
            { chieldMenuTitle: "Microfiber Cloths" },
            { chieldMenuTitle: "Cleaning Sprays" },
            { chieldMenuTitle: "Lens Wipes" },
          ],
          descriptions:
            "Keep your lenses crystal clear and streak-free with premium formulas.",
        },
        {
          subMenuTitle: "Chains & Accessories",
          imageUrl:
            "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=500&q=80",
          chieldMenu: [
            { chieldMenuTitle: "Anti-Slip Cords" },
            { chieldMenuTitle: "Fashion Chains" },
            { chieldMenuTitle: "Repair Tool Kits" },
          ],
          descriptions:
            "Stay stylish and secure your glasses with adjustable premium chains.",
        },
      ],
    },
    {
      imageUrl: "https://example.com/images/clearance-sale.jpg",
      menu: "Clearance SALE",
      subMenu: [
        {
          subMenuTitle: "Flat Discounts",
          imageUrl:
            "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&q=80",
          chieldMenu: [
            { chieldMenuTitle: "Flat 50% Off" },
            { chieldMenuTitle: "Flat 30% Off" },
            { chieldMenuTitle: "Flat 70% Off" },
          ],
          descriptions:
            "Grab last season's top sellers at unbelievable flat discounts.",
        },
        {
          subMenuTitle: "Special Bundles",
          imageUrl:
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80",
          chieldMenu: [
            { chieldMenuTitle: "Buy 1 Get 1 Free" },
            { chieldMenuTitle: "Pack of 2 Deals" },
            { chieldMenuTitle: "Gift Bundles" },
          ],
          descriptions:
            "Get the best value deals with custom curated eyewear bundles.",
        },
        {
          subMenuTitle: "Budget Deals",
          imageUrl:
            "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=500&q=80",
          chieldMenu: [
            { chieldMenuTitle: "Under ৳1500" },
            { chieldMenuTitle: "Under ৳3000" },
            { chieldMenuTitle: "Clearance Frames" },
          ],
          descriptions:
            "Shop premium designer styles that fit budget checkouts perfectly.",
        },
      ],
    },
  ];

  const getTranslateClass = (menuName: string) => {
    const mapping: Record<string, string> = {
      Sunglasses:
        "sm:-translate-x-[153px] md:-translate-x-[105px] lg:-translate-x-[300px] xl:-translate-x-[485px] slim-scroll",
      "Optical Glasses":
        "sm:-translate-x-[200px] md:-translate-x-[245px] lg:-translate-x-[430px] xl:-translate-x-[640px] 2xl:-translate-x-[660px]",
      "Contact Lens":
        "sm:-translate-x-[250px] md:-translate-x-[300px] lg:-translate-x-[500px] xl:-translate-x-[700px] 2xl:-translate-x-[750px]",
      Accessories:
        "sm:-translate-x-[300px] md:-translate-x-[350px] lg:-translate-x-[550px] xl:-translate-x-[750px] 2xl:-translate-x-[800px]",
      "Clearance SALE":
        "sm:-translate-x-[350px] md:-translate-x-[400px] lg:-translate-x-[600px] xl:-translate-x-[800px] 2xl:-translate-x-[850px]",
      Brands:
        "-translate-x-[350px] md:-translate-x-[345px] lg:-translate-x-[612px] xl:-translate-x-[712px]",
      Blogs:
        "sm:-translate-x-[350px] md:-translate-x-[400px] lg:-translate-x-[600px] xl:-translate-x-[750px] 2xl:-translate-x-[850px]",
    };
    return (
      mapping[menuName] ||
      "sm:-translate-x-[200px] lg:-translate-x-[400px] xl:-translate-x-[600px]"
    );
  };

  const blog = navbarMenus.find((item) => item.menu === "Blogs");
  const blogItems =
    blogMenuList.length > 0 ? blogMenuList : (blog?.subMenu as any[]) || [];

  return (
    <div>
      <Menu setActive={setActive} className=" ">
        <div className="hidden lg:block ">
          <MenuItem
            setActive={setActive}
            active={active}
            item="Home"
            href="/"
            className=""
          ></MenuItem>
        </div>

        {navbarMenus.map((menuItem) => {
          const translateClass = getTranslateClass(menuItem.menu);

          // Custom Brands View Layout
          if (menuItem.menu === "Brands") {
            return (
              <MenuItem
                key={menuItem.id}
                setActive={setActive}
                active={active}
                item={menuItem.menu}
                href={menuItem.href || "/brands"}
                className={translateClass}
              >
                <div className="max-h-[calc(100vh-170px)] overflow-y-auto slim-scroll min-h-[412px] sm:w-[595px] md:w-[728px] lg:w-[1000px] xl:w-[1202px] md:-left-[207px] lg:-left-[206px] xl:-left-[180px] 2xl:-left-14 z-10 flex top-[52px] rounded overflow-hidden">
                  {/* left side start */}
                  <div className="w-5/12">
                    <div className="border-b-[1px] p-3">
                      <MyFormWrapper
                        onSubmit={handleSubmit}
                        className="relative h-[45px]"
                      >
                        <MyFormInputAceternity
                          name="search"
                          placeholder="Enter Brand Name"
                          inputClassName=""
                        />
                        <button type="submit">
                          <IoSearchSharp
                            size={20}
                            className="absolute top-[13px] right-3"
                          />
                        </button>
                      </MyFormWrapper>
                    </div>
                    <div className="relative">
                      <div className="max-h-[330px] overflow-hidden overflow-y-auto slim-scroll">
                        {FilteredBrandList?.map((items, i) => (
                          <div key={i} id={items.caption} className="px-5">
                            <h5 className="mt-4 text-lg font-medium leading-normal">
                              {items.caption}
                            </h5>
                            <div className="mb-5">
                              {items.list.map((item, index) => (
                                <span
                                  onClick={() => {
                                    setIsBrandOpen(false);
                                  }}
                                  key={index}
                                >
                                  <Link
                                    href={`/product-filter?brand=${encodeURIComponent(item.title)}`}
                                    onClick={() => setActive(null)}
                                  >
                                    <p className="text-sm font-normal leading-normal mb-2 hover:text-primary-color">
                                      {item.title}
                                    </p>
                                  </Link>
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="flex flex-col absolute top-2 right-2 overflow-hidden slim-scroll">
                          {alphabetList.map((item, index) => (
                            <ScrollButton key={index} to={item} name={item} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* left side end */}
                  {/* right side start */}
                  <div className="w-full">
                    <div className="border-b-[1px] py-[23px]">
                      <h4 className="text-center">Popular Brands</h4>
                    </div>
                    {/* brand images start */}
                    <div className="grid grid-cols-5 gap-5 p-8 h-[360px] overflow-hidden overflow-y-auto slim-scroll">
                      {topBrandListArr.map((item) => (
                        <Link
                          key={item.id}
                          href={`/product-filter?brand=${encodeURIComponent(item.title)}`}
                          onClick={() => setActive(null)}
                          className="group rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-950 hover:border-[#00a76b]/60 transition-colors"
                        >
                          <div className="relative h-24 bg-neutral-100 dark:bg-neutral-900">
                            {item.imageUrl && (
                              <Image
                                src={item.imageUrl}
                                alt={item.title || "Brand"}
                                fill
                                className="object-cover"
                                sizes="160px"
                              />
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-xs font-extrabold group-hover:text-[#00a76b] transition-colors line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">
                              {item.tagline}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {/* brand images end */}
                  </div>
                  {/* right side end */}
                </div>
              </MenuItem>
            );
          }

          // Custom Blogs View Layout
          if (menuItem.menu === "Blogs") {
            return (
              <MenuItem
                key={menuItem.id}
                setActive={setActive}
                active={active}
                item={menuItem.menu}
                href={menuItem.href || "/blogs"}
                className={translateClass}
              >
                <div className="max-h-[calc(100vh-170px)] overflow-hidden overflow-y-auto slim-scroll text-sm grid grid-cols-2 xl:grid-cols-3 gap-4  p-4">
                  {blogItems?.slice(0, 5)?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-start gap-3 md:gap-4 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 hover:border-[#00a76b]/40 hover:bg-[#00a76b]/5 transition-all"
                    >
                      {item.imageUrl && (
                        <div className="relative shrink-0 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950">
                          <Link
                            href={`/blogs/${item?.slug}`}
                            onClick={() => setActive(null)}
                          >
                            <Image
                              src={item.imageUrl}
                              alt={item.subMenuTitle}
                              fill
                              className="object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                              sizes="120px"
                            />
                          </Link>
                        </div>
                      )}
                      <div className="flex flex-col gap-1 whitespace-normal flex-1">
                        <Link
                          href={`/blogs/${item?.slug}`}
                          onClick={() => setActive(null)}
                        >
                          <h3 className="hover:text-[#00a76b] text-base lg:text-lg font-bold text-neutral-900 dark:text-white transition-colors line-clamp-1">
                            {item.subMenuTitle}
                          </h3>
                        </Link>
                        {/* max text lenght 150 than ... */}
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mt-0.5 max-w-[200px] truncate">
                          {item.descriptions ||
                            "Explore our latest editorial stories and styling tips."}
                        </p>
                        <Link
                          href={`/blogs/${item?.slug}`}
                          onClick={() => setActive(null)}
                          className="text-xs font-bold text-[#00a76b] hover:underline inline-flex items-center gap-1 mt-2"
                        >
                          <span>Explore Articles</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* All Blogs Card (matching other navbar section cards) */}
                  <div className="flex flex-col md:flex-row items-start md:gap-4 p-4 bg-[#007C74]/5 rounded-xl border border-[#007C74]/15 hover:bg-[#007C74]/10 transition-colors h-full min-h-[144px]">
                    <div className="flex flex-col justify-between h-full whitespace-nowrap">
                      <div>
                        <h3 className="text-lg font-black text-[#007C74]">
                          All Blogs & Stories
                        </h3>
                        <p className="text-xs text-muted-foreground whitespace-normal mt-1.5 max-w-[160px]">
                          Browse our complete collection of eyewear articles &
                          style stories.
                        </p>
                      </div>
                      <Link
                        href="/blogs"
                        onClick={() => setActive(null)}
                        className="text-xs font-bold text-[#00a76b] flex items-center gap-1 group mt-4 cursor-pointer"
                      >
                        <span>View All Collection</span>
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </MenuItem>
            );
          }

          const activeSubMenu = menuItem.subMenu
            ? (menuItem.subMenu as any[]).filter(
                (item: any) => item.isActive !== false,
              )
            : [];
          const hasSubmenu = activeSubMenu.length > 0;
          const categoryHref =
            menuItem.href ||
            `/product-filter?category=${encodeURIComponent(menuItem.menu)}`;
          // Extract the category slug that matches what the backend expects
          // e.g. href="/product-filter?category=optical" → categorySlug="optical"
          const hrefCategorySlug = (() => {
            try {
              const url = new URL(menuItem.href || "", "http://x");
              const cat = url.searchParams.get("category");
              return cat || encodeURIComponent(menuItem.menu);
            } catch {
              return encodeURIComponent(menuItem.menu);
            }
          })();

          // Generic Dynamic Category Dropdown Layout
          return (
            <MenuItem
              key={menuItem.id}
              setActive={setActive}
              active={active}
              item={menuItem.menu}
              href={categoryHref}
              className={translateClass}
            >
              {hasSubmenu ? (
                <div className="max-h-[calc(100vh-170px)] overflow-hidden overflow-y-auto slim-scroll text-sm grid grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-10 p-4">
                  {activeSubMenu.map((item: any, index: number) => {
                    const subHref =
                      item.href ||
                      `/product-filter?category=${encodeURIComponent(hrefCategorySlug)}&subCategory=${encodeURIComponent(item.subMenuTitle)}`;
                    const activeChildren = item.chieldMenu
                      ? item.chieldMenu.filter(
                          (chieldItem: any) => chieldItem.isActive !== false,
                        )
                      : [];
                    return (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row items-start gap-1 md:gap-4"
                      >
                        {item.imageUrl && (
                          <div>
                            <Link
                              href={subHref}
                              onClick={() => setActive(null)}
                            >
                              <div className="sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-36 lg:w-36">
                                <Image
                                  src={item.imageUrl}
                                  className="rounded-md cursor-pointer h-full w-full"
                                  height={150}
                                  width={150}
                                  alt=""
                                />
                              </div>
                            </Link>
                          </div>
                        )}
                        <div className="flex flex-col lg:gap-1 whitespace-nowrap">
                          <Link href={subHref} onClick={() => setActive(null)}>
                            <h3 className="hover:text-[#00a76b] text-xl w-min font-bold relative group cursor-pointer">
                              {item.subMenuTitle}
                              <span className="absolute left-0 bottom-0 h-0.5 w-full bg-[#00a76b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                            </h3>
                          </Link>
                          {activeChildren.map(
                            (chieldItem: any, idx: number) => {
                              const childHref =
                                chieldItem.href ||
                                `/product-filter?category=${encodeURIComponent(hrefCategorySlug)}&subCategory=${encodeURIComponent(item.subMenuTitle)}&type=${encodeURIComponent(chieldItem.chieldMenuTitle)}`;
                              return chieldItem.chieldMenuTitle ? (
                                <Link
                                  key={idx}
                                  href={childHref}
                                  onClick={() => setActive(null)}
                                >
                                  <p className="hover:text-[#00a76b] w-min text-base font-medium relative group cursor-pointer">
                                    {chieldItem.chieldMenuTitle}
                                    <span className="absolute left-0 bottom-0 h-0.5 w-full bg-[#00a76b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                                  </p>
                                </Link>
                              ) : null;
                            },
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* View All Dynamic Card */}
                  <div className="flex flex-col md:flex-row items-start md:gap-4 p-4 bg-[#007C74]/5 rounded-xl border border-[#007C74]/15 hover:bg-[#007C74]/10 transition-colors h-full min-h-[144px]">
                    <div className="flex flex-col justify-between h-full whitespace-nowrap">
                      <div>
                        <h3 className="text-lg font-black text-[#007C74]">
                          All {menuItem.menu}
                        </h3>
                        <p className="text-xs text-muted-foreground whitespace-normal mt-1.5 max-w-[160px]">
                          Browse our complete range of quality{" "}
                          {menuItem.menu.toLowerCase()}.
                        </p>
                      </div>
                      <Link
                        href={categoryHref}
                        onClick={() => setActive(null)}
                        className="text-xs font-bold text-[#00a76b] flex items-center gap-1 group mt-4 cursor-pointer"
                      >
                        <span>View All Collection</span>
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default DropDownMenus;
