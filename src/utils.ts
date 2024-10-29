import { type Redirect } from "next";

/**
 * `isRedirect` is a type guard function to narrow the type of a GetStaticProps/GetServerSideProps result
 */
export function isRedirect(result: any): result is { redirect: Redirect } {
  return result && "redirect" in result;
}

/**
 * `isNotFound` is a type guard function to narrow the type of a GetStaticProps/GetServerSideProps result
 */
export function isNotFound(result: any): result is { notFound: true } {
  return result && "notFound" in result && result.notFound === true;
}
