/**
 * `isRedirect` is a type guard function to narrow the type of a GetStaticProps/GetServerSideProps result
 */
export function isRedirect(result) {
    return result && "redirect" in result;
}
/**
 * `isNotFound` is a type guard function to narrow the type of a GetStaticProps/GetServerSideProps result
 */
export function isNotFound(result) {
    return result && "notFound" in result && result.notFound === true;
}
