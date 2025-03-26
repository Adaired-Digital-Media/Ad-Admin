import { ProductFormValues } from "@/validators/create-product.schema";

export function defaultValues(product?: ProductFormValues) {
  return {
    _id: product ? product._id : undefined,
    featuredImage: product ? product.featuredImage : "",
    name: product ? product.name : "",
    description: product ? product.description : "",
    category: product ? product.category : "",
    subCategory: product ? product.subCategory : [],
    minimumQuantity: product ? product.minimumQuantity : undefined,
    minimumWords: product ? product.minimumWords : undefined,
    slug: product ? product.slug : "",
    pricePerUnit: product ? product.pricePerUnit : undefined,
    pricingType: product ? product.pricingType : "perQuantity",
    stock: product ? product.stock : undefined,
    images: product ? product.images : [],
    tags: product ? product.tags : [],
    priority: product ? product.priority : undefined,
    keywords: product ? product.keywords : [],
    formId: product ? product.formId : "",
    metaTitle: product ? product.metaTitle : "",
    metaDescription: product ? product.metaDescription : "",
    canonicalLink: product ? product.canonicalLink : "",
    status: product ? product.status : "Active",
    isFreeProduct: product ? product.isFreeProduct : false,
    createdBy: product ? product.createdBy : undefined,
    updatedBy: product ? product.updatedBy : undefined,
    createdAt: product ? product.createdAt : undefined,
    updatedAt: product ? product.updatedAt : undefined,
    __v: product ? product.__v : undefined,
  };
}
