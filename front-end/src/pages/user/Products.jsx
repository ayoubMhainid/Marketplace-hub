import { useEffect, useRef, useState } from "react";
import { Product } from "../../components/App/Product";
import { UserSideBar } from "../../layouts/UserSideBar";
import { getAllProducts } from "../../services/productServices";
import { Button } from "../../components/ui/Button";
import { ProductSkeleton } from "../../components/skeletons/ProductSkeleton";
import { getCategoryList } from "../../services/categoryServices";
export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({});
  const [page, setPage] = useState(1);
  const hasMore = useRef(true);
  const loadingRef = useRef(false);

  const getProducts = async (page) => {
    if (loadingRef.current || !hasMore.current) return;

    loadingRef.current = true;
    setLoading(true);
    try {
      const response = await getAllProducts(page);
      setLoading(false);
      loadingRef.current = false;

      if (response.data.products.data.length === 0) {
        hasMore.current = false;
        return;
      }

      setProducts((prevProducts) => [
        ...prevProducts,
        ...response.data.products.data,
      ]);
    } catch (error) {
      setLoading(false);
      loadingRef.current = false;
      if (error.response) {
        setNotification({ type: "error", message: error.response.message });
      } else {
        setNotification({ type: "error", message: "Try again later" });
      }
    }
  };
  const getCategories = async () => {
    try {
      const response = await getCategoryList(localStorage.getItem("token"));
      if (response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      if (error.response) {
        setNotification({
          type: "error",
          message: error.response.data.message,
        });
      } else {
        setNotification({ type: "error", message: "Try again later" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 1;
      if (isAtBottom && !loadingRef.current) {
        const nextPage = page + 1;
        setPage(nextPage);
        await getProducts(nextPage);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getProducts(page);
    getCategories();
  }, [page]);
  return (
    <div>
      <div>
        <UserSideBar />
      </div>

      <div className="lg:ml-[21%] px-2 mt-8">
        <div>
          <h1 className="text-3xl font-semibold">Filter products by</h1>
          <div className="mt-2 flex gap-4">
            <select
              className="bg-blue-500 mb-3 w-[20%] text-center py-2 px-2 cursor-pointer rounded-md"
              name="category"
            >
              {categories && categories.length
                ? categories.map((category) => {
                    return (
                      <option value={category.categoryName}>
                        {category.categoryName}
                      </option>
                    );
                  })
                : null}
            </select>
            <select
              className="bg-blue-500 mb-3 w-[15%] text-center py-2 px-2 cursor-pointer rounded-md"
              name="category"
            >
              <option>{"0 -> 100"}</option>
              <option>{"100 -> 500"}</option>
              <option>{"> 500"}</option>
            </select>
            <select
              className="bg-blue-500 mb-3 w-[15%] text-center py-2 px-2 cursor-pointer rounded-md"
              name="category"
            >
              <option>possible deleivy</option>
              <option>Impossible deleivy</option>
            </select>
            <Button
              type={"submit"}
              width={"15%"}
              text={"Filter"}
              bg={"bg-green-700"}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-wrap">
          {products && products.length
            ? products.map((product) => {
                return <Product productData={product} />;
              })
            : null}
        </div>
        <div className="mt-4">
          {loading ? (
            <div className="flex flex-col gap-2">
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
