<script>
    import Navbar from "../lib/components/navbar.svelte";
    import Footer from "../lib/components/footer.svelte";
    import SearchBar from "../lib/components/searchBar.svelte";
</script>

<header class="main-header">
    <!-- Main Nav -->
    <Navbar />

    <!-- Search Bar -->
    <!-- <SearchBar /> -->
</header>
<!-- Main Content -->
<slot></slot>