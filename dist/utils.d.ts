import { type Redirect } from "next";
/**
 * `isRedirect` is a type guard function to narrow the type of a GetStaticProps/GetServerSideProps result
 */
export declare function isRedirect(result: any): result is {
    redirect: Redirect;
};
/**
 * `isNotFound` is a type guard function to narrow the type of a GetStaticProps/GetServerSideProps result
 */
export declare function isNotFound(result: any): result is {
    notFound: true;
};
