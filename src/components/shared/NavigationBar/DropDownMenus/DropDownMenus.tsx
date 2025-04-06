/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import { Menu, MenuItem } from "@/components/ui/navbar-menu";
import ScrollButton from "@/components/ui/ScrollButton/ScrollButton";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";

interface BrandItem {
  id: number;
  title: string;
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
  console.log(active);

  const handleSubmit = (data: FieldValues, reset: any) => {
    console.log("Form Data:", data);
    // reset(); // Uncomment this line to reset the form after submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  // search bar end

  const [brandList, setBrandList] = useState<Brand[]>([]);
  const [topBrandListArr, setTopBrandListArr] = useState<BrandItem[]>([]);
  const [FilteredBrandList, setFilteredBrandList] = useState<Brand[]>(brandList);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  // const { register, handleSubmit, watch, setValue } = useForm<{ search: string }>();

  // const watchSearch = watch("search");
  let watchSearch: any;
  const topBrandList: TopBrand[] = [{ id: 999999, caption: "Top Brands", list: [...topBrandListArr] }];

  useEffect(() => {
    if (watchSearch?.length > 0) {
      const filteredList: Brand[] = [];
      brandList.forEach((brand) => {
        const filteredItems = brand.list.filter((item) => item.title.toLowerCase().includes(watchSearch.toLowerCase()));
        if (filteredItems.length > 0) {
          filteredList.push({ ...brand, list: filteredItems });
        }
      });
      setFilteredBrandList(filteredList);
    } else {
      setFilteredBrandList(brandList);
    }
  }, [watchSearch, brandList]);

  const data = [
    {
      id: 1,
      caption: "A",
      list: [
        { id: 11, title: "apple" },
        { id: 12, title: "almond" },
      ],
    },
    {
      id: 2,
      caption: "B",
      list: [
        { id: 21, title: "ball" },
        { id: 22, title: "banana" },
      ],
    },
    {
      id: 3,
      caption: "C",
      list: [
        { id: 31, title: "cat" },
        { id: 32, title: "carrot" },
      ],
    },
    {
      id: 4,
      caption: "D",
      list: [
        { id: 41, title: "dog" },
        { id: 42, title: "date" },
      ],
    },
    {
      id: 5,
      caption: "E",
      list: [
        { id: 51, title: "elephant" },
        { id: 52, title: "eggplant" },
      ],
    },
    {
      id: 6,
      caption: "F",
      list: [
        { id: 61, title: "fox" },
        { id: 62, title: "fig" },
      ],
    },
    {
      id: 7,
      caption: "G",
      list: [
        { id: 71, title: "giraffe" },
        { id: 72, title: "grape" },
      ],
    },
    {
      id: 8,
      caption: "H",
      list: [
        { id: 81, title: "horse" },
        { id: 82, title: "honeydew" },
      ],
    },
    {
      id: 9,
      caption: "I",
      list: [
        { id: 91, title: "iguana" },
        { id: 92, title: "ice cream" },
      ],
    },
    {
      id: 10,
      caption: "J",
      list: [
        { id: 101, title: "jaguar" },
        { id: 102, title: "jelly" },
      ],
    },
    {
      id: 11,
      caption: "K",
      list: [
        { id: 111, title: "koala" },
        { id: 112, title: "kiwi" },
      ],
    },
    {
      id: 12,
      caption: "L",
      list: [
        { id: 121, title: "lion" },
        { id: 122, title: "lemon" },
      ],
    },
    {
      id: 13,
      caption: "M",
      list: [
        { id: 131, title: "monkey" },
        { id: 132, title: "melon" },
      ],
    },
    {
      id: 14,
      caption: "N",
      list: [
        { id: 141, title: "newt" },
        { id: 142, title: "nutmeg" },
      ],
    },
    {
      id: 15,
      caption: "O",
      list: [
        { id: 151, title: "owl" },
        { id: 152, title: "orange" },
      ],
    },
    {
      id: 16,
      caption: "P",
      list: [
        { id: 161, title: "penguin" },
        { id: 162, title: "pear" },
      ],
    },
    {
      id: 17,
      caption: "Q",
      list: [
        { id: 171, title: "quokka" },
        { id: 172, title: "quince" },
      ],
    },
    {
      id: 18,
      caption: "R",
      list: [
        { id: 181, title: "rhino" },
        { id: 182, title: "raspberry" },
      ],
    },
    {
      id: 19,
      caption: "S",
      list: [
        { id: 191, title: "snake" },
        { id: 192, title: "strawberry" },
      ],
    },
    {
      id: 20,
      caption: "T",
      list: [
        { id: 201, title: "tiger" },
        { id: 202, title: "tomato" },
      ],
    },
    {
      id: 21,
      caption: "U",
      list: [
        { id: 211, title: "umbrella bird" },
        { id: 212, title: "ugli fruit" },
      ],
    },
    {
      id: 22,
      caption: "V",
      list: [
        { id: 221, title: "vulture" },
        { id: 222, title: "vanilla" },
      ],
    },
    {
      id: 23,
      caption: "W",
      list: [
        { id: 231, title: "whale" },
        { id: 232, title: "watermelon" },
      ],
    },
    {
      id: 24,
      caption: "X",
      list: [
        { id: 241, title: "x-ray tetra" },
        { id: 242, title: "xylophone" },
      ],
    },
    {
      id: 25,
      caption: "Y",
      list: [
        { id: 251, title: "yak" },
        { id: 252, title: "yogurt" },
      ],
    },
    {
      id: 26,
      caption: "Z",
      list: [
        { id: 261, title: "zebra" },
        { id: 262, title: "zucchini" },
      ],
    },
  ];

  useEffect(() => {
    if (data) {
      setBrandList([...data]);
    }
    // if (data) {
    //     setTopBrandListArr([...data.list]);
    // }
  }, []);

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
    subMenuTitle: string;
    imageUrl: string;
    chieldMenu: ChildMenu[] ;
    descriptions: string; // Optional field
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
          chieldMenu: [{ chieldMenuTitle: "Casual" }, { chieldMenuTitle: "Sports" }, { chieldMenuTitle: "Luxury" }, { chieldMenuTitle: "Polarized" }],
             descriptions:""
        },
        {
          subMenuTitle: "Women's Sunglasses",
          imageUrl: "https://img.freepik.com/premium-photo/woman-wearing-hat-sunglasses-is-posing-photo_1185498-16798.jpg?w=1380",
          chieldMenu: [
            { chieldMenuTitle: "Casual" },
            { chieldMenuTitle: "Luxury" },
            { chieldMenuTitle: "Fashion" },
            { chieldMenuTitle: "Oversized" },
          ],
             descriptions:""
        },
        {
          subMenuTitle: "Kids' Sunglasses",
          imageUrl: "https://img.freepik.com/premium-psd/child-travel-style_510503-155.jpg?w=740",
          chieldMenu: [{ chieldMenuTitle: "Boys" }, { chieldMenuTitle: "Girls" }, { chieldMenuTitle: "Trendy" }, { chieldMenuTitle: "Protective" }],
             descriptions:""
        },
        {
          subMenuTitle: "Polarized Sunglasses",
          imageUrl: "https://img.freepik.com/premium-photo/product-photography-green-outdoor-sunglass_162944-3148.jpg?w=740",
          chieldMenu: [
            { chieldMenuTitle: "Men's Polarized" },
            { chieldMenuTitle: "Women's Polarized" },
            { chieldMenuTitle: "Sport Polarized" },
            { chieldMenuTitle: "Stylish Polarized" },
          ],
             descriptions:""
        },
        {
          subMenuTitle: "Aviator Sunglasses",
          imageUrl: "https://www.randolphusa.com/cdn/shop/articles/Mr.-Randolph-color_600x600_crop_center.jpg?v=1584122243",
          chieldMenu: [
            { chieldMenuTitle: "Classic Aviator" },
            { chieldMenuTitle: "Modern Aviator" },
            { chieldMenuTitle: "Metal Aviator" },
            { chieldMenuTitle: "Colored Aviator" },
          ],
             descriptions:""
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
          chieldMenu: [{ chieldMenuTitle: "Business" }, { chieldMenuTitle: "Casual" }, { chieldMenuTitle: "Fashion" }, { chieldMenuTitle: "Luxury" }],
          descriptions:""
        },
        {
          subMenuTitle: "Women's Optical Glasses",
          imageUrl: "https://img.freepik.com/premium-photo/blond-woman-wearing-glasses-hat-posing-picture-generative-ai_1034973-93773.jpg?w=740",
          chieldMenu: [
            { chieldMenuTitle: "Fashion" },
            { chieldMenuTitle: "Professional" },
            { chieldMenuTitle: "Luxury" },
            { chieldMenuTitle: "Trendy" },
          ],
          descriptions:""
        },
        {
          subMenuTitle: "Kids' Optical Glasses",
          imageUrl: "https://static.zennioptical.com/marketing/category/kids/4tile/4_tile_var_b_1/kids_tlc_4Tile_xs.png",
          chieldMenu: [{ chieldMenuTitle: "Boys" }, { chieldMenuTitle: "Girls" }, { chieldMenuTitle: "Durable" }, { chieldMenuTitle: "Colorful" }],
             descriptions:""
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
             descriptions:""
        },
        {
          subMenuTitle: "Progressive Lenses",
          imageUrl: "https://i.ebayimg.com/images/g/VkEAAOSwW-xjdlTA/s-l1200.webp",
          chieldMenu: [
            { chieldMenuTitle: "Men's Progressive" },
            { chieldMenuTitle: "Women's Progressive" },
            { chieldMenuTitle: "Bifocal" },
            { chieldMenuTitle: "Photochromic" },
          ],
             descriptions:""
        },
      ],
    },
    {
      imageUrl: "https://example.com/images/blog.jpg",
      menu: "Blog",
      subMenu: [
        {
          subMenuTitle: "Sunglasses Trends",
          imageUrl: "https://www.shopz.com.bd/wp-content/uploads/2022/01/Emosnia-Small-Rectangle-Sunglasses-Men-Women.jpg",
          descriptions: "Discover the latest trends in sunglasses fashion for the current year.",
          chieldMenu: [
            { chieldMenuTitle: "" },
          ],
          
        },
        {
          subMenuTitle: "Optical Glasses Care",
          imageUrl: "https://raha.com.bd/public/uploads/all/5BmKMNduyhHOsQvZISiWnKXM9LycMWyS0B9eME7a.jpg",
          descriptions: "Learn how to take care of your optical glasses to keep them in top condition.",
          chieldMenu: [
            { chieldMenuTitle: "" },
          ],
        },
        {
          subMenuTitle: "Health & Vision",
          imageUrl: "https://eoms.cutpricebd.com/oms_products/big/164182003637874_27417.png",
          descriptions: "Tips and advice on maintaining healthy vision and eye care.",
          chieldMenu: [
            { chieldMenuTitle: "" },
          ],
        },
        {
          subMenuTitle: "Brand Spotlights",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREvUxGf1C6Z4xXkvxG0lqvgvdTNvf0R17OvBccRwUSTLHwQyd7QQYGNGnxxpSCAN09vOI&usqp=CAU",
          descriptions: "Highlighting the top eyewear brands and their latest collections.",
          chieldMenu: [
            { chieldMenuTitle: "" },
          ],
        },
        {
          subMenuTitle: "Customer Stories",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvVM_ki9-mvQORnvC7qApj188IWzvrPkHtpGFakcAbSWZKbsYllOtOX21AxIY8c55UMu0&usqp=CAU",
          descriptions: "Read about the experiences and stories from our satisfied customers.",
          chieldMenu: [
            { chieldMenuTitle: "" },
          ],
        },
        {
          subMenuTitle: "Tech Insights",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0a6mQf-lrLXZljIPZBbCqi6dYwf1ehST0760WLlzbu6RRKyPHtb-Wb4ddxHLjbIQew-0&usqp=CAU",
          descriptions: "Stay updated with the latest technological advancements in eyewear.",
          chieldMenu: [
            { chieldMenuTitle: "" },
          ],
        },
        {
          subMenuTitle: "Seasonal Picks",
          imageUrl: "https://static-01.daraz.com.bd/p/f612727fc1eb2297d46c27ad371cf08a.jpg_750x750.jpg_.webp",
          descriptions: "Find the best eyewear picks for the current season.",
          chieldMenu: [
            { chieldMenuTitle: "" },
          ],
        },
        {
          subMenuTitle: "Travel Essentials",
          imageUrl:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/33eed6d37daf73ed84b0549f7238426d.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp",
          descriptions: "Must-have eyewear for travelers, ensuring comfort and protection.",
            chieldMenu: [
                { chieldMenuTitle: "" },
            ],
        },
        {
          subMenuTitle: "Style Guides",
          imageUrl:
            "https://www.jiomart.com/images/product/original/rvzeicz9k1/campeon-uv-400-protection-avaitor-black-frame-green-glass-sunglasses-for-men-and-women-pack-of-1-product-images-rvzeicz9k1-6-202202062353.jpg?im=Resize=(500,630)",
          descriptions: "Comprehensive guides to help you choose the right style of eyewear.",
            chieldMenu: [
                { chieldMenuTitle: "" },
            ],
        },
      ],
    },
  ];

  const sunglasses = fakeData.find((item) => item.menu === "Sunglasses");
  const opticalGlasses = fakeData.find((item) => item.menu === "Optical Glasses");
  const blog = fakeData.find((item) => item.menu === "Blog");

  return (
    <div>
      <Menu setActive={setActive} className=" ">
        <div className="hidden lg:block ">
          <MenuItem setActive={setActive} active={active} item="Home" href="/" className=""></MenuItem>
        </div>
        <MenuItem
          setActive={setActive}
          active={active}
          item="Sunglasses"
          href="/"
          className="sm:-translate-x-[153px] md:-translate-x-[105px] lg:-translate-x-[300px]  xl:-translate-x-[485px] slim-scroll "
        >
          <div className="max-h-[calc(100vh-170px)] overflow-hidden overflow-y-auto slim-scroll  text-sm grid grid-cols-2 xl:grid-cols-3 sm:gap-3 lg:gap-10 p-4 ">
            {sunglasses?.subMenu.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:gap-4 ">
                <div>
                  <Link href={""}>
                    <div className="sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-36 lg:w-36">
                      <Image src={item.imageUrl} className="rounded-md cursor-pointer h-full w-full" height={150} width={150} alt="" />
                    </div>
                  </Link>
                </div>
                <div className="flex flex-col lg:gap-1 whitespace-nowrap">
                  <Link href={""}>
                    <h3 className={` hover:text-[#00a76b] text-xl w-min font-bold relative group cursor-pointer `}>
                      {item.subMenuTitle}
                      <span className="absolute left-0 bottom-0 h-0.5 w-full bg-[#00a76b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                    </h3>
                  </Link>
                  {item.chieldMenu.map((chieldItem, index) => (
                    <Link key={index} href={""}>
                      <p className={` hover:text-[#00a76b]  w-min text-base font-medium relative group cursor-pointer `}>
                        {chieldItem.chieldMenuTitle}
                        <span className="absolute left-0 bottom-0 h-0.5 w-full bg-[#00a76b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 "></span>
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Optical Glasses" href="/" className="sm:-translate-x-[200px] md:-translate-x-[245px] lg:-translate-x-[430px] xl:-translate-x-[640px] 2xl:-translate-x-[660px] ">
          <div className="max-h-[calc(100vh-170px)] overflow-hidden overflow-y-auto slim-scroll  text-sm grid grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-10 p-4">
            {opticalGlasses?.subMenu.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start gap-1 md:gap-4">
                <div>
                  <Link href={""}>
                    <div className="sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-36 lg:w-36">
                      <Image src={item.imageUrl} className="rounded-md cursor-pointer h-full w-full" height={150} width={150} alt="" />
                    </div>
                  </Link>
                </div>
                <div className="flex flex-col lg:gap-1 whitespace-nowrap">
                  <Link href={""}>
                    <h3 className={` hover:text-[#00a76b] text-xl w-min font-bold relative group cursor-pointer`}>
                      
                      {item.subMenuTitle.length > 20 ? item.subMenuTitle.substring(0, 20) + "..." : item.subMenuTitle}
                      <span className="absolute left-0 bottom-0 h-0.5 w-full bg-[#00a76b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                    </h3>
                  </Link>
                  {item.chieldMenu.map((chieldItem, index) => (
                    <Link key={index} href={""}>
                      <p className={` hover:text-[#00a76b] w-min text-base font-medium relative group cursor-pointer`}>
                        {chieldItem.chieldMenuTitle}
                        <span className="absolute left-0 bottom-0 h-0.5 w-full bg-[#00a76b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {/* <ProductItem
              title="Anti-Reflective Coating"
              href=""
              src="https://da4e1j5r7gw87.cloudfront.net/wp-content/uploads/sites/4460/2023/06/Glasses-On-The-Road.jpg"
              description="Reduce glare with anti-reflective lenses"
            />
            <ProductItem
              title="Computer Glasses"
              href=""
              src="https://www.cnet.com/a/img/toFeyyNRJ23GqHaZQFM-kfTJRYc/u003d/940x0/2020/07/17/e1c89e0d-6662-4bbc-b564-14a0b63544a4/blueease.jpg"
              description="Glasses for computer use"
            /> */}
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Brands" className=" -translate-x-[350px] md:-translate-x-[345px] lg:-translate-x-[612px] xl:-translate-x-[712px] ">
          <div
            // style={{ boxShadow: "0px 4px 20px 0px rgba(36, 52, 58, 0.10)" }}
            className={`max-h-[calc(100vh-170px)] overflow-y-auto slim-scroll min-h-[412px] sm:w-[595px] md:w-[728px] lg:w-[1000px] xl:w-[1202px] md:-left-[207px] lg:-left-[206px] xl:-left-[180px] 2xl:-left-14  z-10 flex top-[52px] rounded overflow-hidden `}
          >
            {/* left side start */}
            <div className=" w-5/12">
              <div className="border-b-[1px] h- p-3">
                {/* <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("search")}
                      placeholder="Search Brands"
                      className="input w-full ps-9 py-[6px]  rounded-sm"
                    />
                    <button className="absolute top-[10px] left-2" type="submit">
                    
                    </button>
                  </div>
                </form> */}

                <MyFormWrapper onSubmit={handleSubmit} className="relative h-[45px]">
                  <MyFormInputAceternity name="email" placeholder="Enter Brand Name" inputClassName="" />
                  <button type="submit">
                    <IoSearchSharp size={20} className="absolute top-[13px] right-3" />
                  </button>
                </MyFormWrapper>
              </div>
              <div className="relative">
                <div className="max-h-[330px] overflow-hidden overflow-y-auto slim-scroll">
                  <>
                    {/* {watchSearch?.length > 0 || (
                      <>
                        {topBrandList?.map((items, i) => (
                          <div key={i} id={items.caption} className="px-5 ">
                            <h5 className="mt-4 mb-2  text-lg font-medium leading-normal">{items.caption}</h5>
                            <div className="mb-5">
                              {items.list.map((item, index) => (
                                <span
                                  onClick={() => {
                                    setValue("search", "");
                                    setIsBrandOpen(false);
                                  }}
                                  key={index}
                                >
                                  <Link href={`/product-filter?brand=${item?.id}`}>
                                    <p className={`text-sm font-normal leading-normal mb-2 hover:text-primary-color `}>{item?.title}</p>
                                  </Link>
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </>
                    )} */}
                  </>
                  {FilteredBrandList?.map((items, i) => (
                    <div key={i} id={items.caption} className="px-5 ">
                      <h5 className="mt-4  text-lg font-medium leading-normal">{items.caption}</h5>
                      <div className="mb-5">
                        {items.list.map((item, index) => (
                          <span
                            onClick={() => {
                              // setValue("search", "");
                              setIsBrandOpen(false);
                            }}
                            key={index}
                          >
                            <Link href={`/product-filter?brand=${item?.id}`}>
                              <p className={`text-sm font-normal leading-normal mb-2 hover:text-primary-color `}>{item.title}</p>
                            </Link>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col absolute top-2 right-2 overflow-hidden slim-scroll">
                    {alphabetList.map((item, index) => (
                      <ScrollButton key={index} to={item} name={item} />
                      // <div className="flex flex-col">{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* left side end */}
            {/* right side start */}
            <div className=" w-full">
              <div className="border-b-[1px] py-[23px]">
                <h4 className="text-center">Popular Brands</h4>
              </div>
              {/* brand images start */}
              <div className="grid grid-cols-5 gap-5 p-8 h-[360px] overflow-hidden overflow-y-auto slim-scroll">
                {/* Replace with your brand images logic */}
              </div>
              {/* brand images end */}
            </div>
            {/* right side end */}
          </div>
        </MenuItem>

        <MenuItem
          setActive={setActive}
          active={active}
          item="Blogs"
          href="/"
          className=" -translate-x-[375px] lg:-translate-x-[600px] 2xl:-translate-x-[910px]"
        >
          <div className=" max-h-[calc(100vh-170px)] overflow-hidden overflow-y-auto slim-scroll  text-sm grid grid-cols-2  lg:grid-cols-3 2xl:grid-cols-5 gap-x-20 gap-y-4 md:gap-x-24  p-4">
            {blog?.subMenu.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="h-14 w-14">
                  <Link href={""}>
                    <Image src={item.imageUrl} className="rounded-md cursor-pointer h-full w-full" height={150} width={150} alt="" />
                  </Link>
                </div>
                <div className="flex flex-col gap-1 max-w-[140px]">
                  <Link href={""}>
                    <h3 className={` hover:text-[#00a76b] text-sm w-min font-bold relative group cursor-pointer whitespace-nowrap`}>
                      {item.subMenuTitle.length > 20 ? item.subMenuTitle.substring(0, 20) + "..." : item.subMenuTitle}
                      <span className="absolute left-0 bottom-0 h-0.5 w-full bg-[#00a76b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                    </h3>
                    <p className="">{item?.descriptions.length > 30 ? item?.descriptions.substring(0, 30) + "..." : item.descriptions}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DropDownMenus;
